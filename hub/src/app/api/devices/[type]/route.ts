import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { deviceInputSchema } from "@hub/lib/validation";
import { devices } from "@hub/lib/deviceStore";
import type { Device } from "@hub/types/device";

const allowedTypes = ["light", "thermostat", "camera"] as const;

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;

  if (!allowedTypes.includes(type as any)) {
    return NextResponse.json({ error: "Invalid device type" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = deviceInputSchema.safeParse({ ...body, type });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const deviceData = parsed.data as Omit<Device, "id">;
    const newDevice: Device = { id: uuidv4(), ...deviceData };

    devices.set(newDevice.id, newDevice);

    return NextResponse.json(newDevice, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const allDevices = Array.from(devices.values());
  return NextResponse.json(allDevices, { status: 200 });
}