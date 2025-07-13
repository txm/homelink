import { PATCH } from "../src/app/api/devices/[id]/route";
import { POST } from "../src/app/api/devices/[type]/route";
import { NextRequest } from "next/server";
import { expect, it, describe, beforeEach } from "vitest";
import { devices } from "@hub/lib/deviceStore";

function mockRequest(json: any): NextRequest {
  return {
    json: async () => json,
  } as unknown as NextRequest;
}

describe("PATCH /api/devices/[id]", () => {
  beforeEach(() => {
    devices.clear();
  });

  it("updates the status of an existing device", async () => {
    const createRes = await POST(
      mockRequest({ name: "Heater", status: { on: false } }),
      { params: { type: "thermostat" } }
    );
    const created = await createRes.json();

    const patchRes = await PATCH(
      mockRequest({ status: { on: true } }),
      { params: { id: created.id } }
    );
    const body = await patchRes.json();

    expect(patchRes.status).toBe(200);
    expect(body.status).toEqual({ on: true });
    expect(body.name).toBe("Heater");
  });

  it("returns 404 if device not found", async () => {
    const res = await PATCH(mockRequest({ status: { on: true } }), {
      params: { id: "non-existent-id" },
    });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Device not found");
  });

  it("preserves other fields if not included", async () => {
    const createRes = await POST(
      mockRequest({ name: "Light A", status: { on: false } }),
      { params: { type: "light" } }
    );
    const created = await createRes.json();

    const patchRes = await PATCH(mockRequest({}), {
      params: { id: created.id },
    });
    const body = await patchRes.json();

    expect(patchRes.status).toBe(200);
    expect(body.name).toBe("Light A");
    expect(body.status).toEqual({ on: false });
  });
});