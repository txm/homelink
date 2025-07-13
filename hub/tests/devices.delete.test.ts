import { DELETE } from "../src/app/api/devices/[id]/route";
import { POST } from "../src/app/api/devices/[type]/route";
import { NextRequest } from "next/server";
import { expect, it, describe, beforeEach } from "vitest";
import { devices } from "@hub/lib/deviceStore";

function mockRequest(): NextRequest {
  return {} as unknown as NextRequest;
}

describe("DELETE /api/devices/[id]", () => {
  beforeEach(() => {
    devices.clear();
  });

  it("deletes an existing device", async () => {
    const createRes = await POST(
      {
        json: async () => ({
          name: "Test Device",
          status: { on: true },
        }),
      } as unknown as NextRequest,
      { params: { type: "light" } }
    );

    const created = await createRes.json();
    expect(devices.has(created.id)).toBe(true);

    const deleteRes = await DELETE(mockRequest(), {
      params: { id: created.id },
    });
    const body = await deleteRes.json();

    expect(deleteRes.status).toBe(200);
    expect(body.success).toBe(true);
    expect(devices.has(created.id)).toBe(false);
  });

  it("returns 404 for non-existent device", async () => {
    const res = await DELETE(mockRequest(), {
      params: { id: "nonexistent" },
    });

    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Device not found");
  });
});