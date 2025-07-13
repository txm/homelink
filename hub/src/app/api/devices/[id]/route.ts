import { NextRequest, NextResponse } from "next/server";
import { devices } from "@hub/lib/deviceStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const device = devices.get(params.id);

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  return NextResponse.json(device, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!devices.has(id)) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const device = devices.get(id)!;
    const updated = {
      ...device,
      status: body.status ?? device.status,
      name: body.name ?? device.name,
    };

    devices.set(id, updated);

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}