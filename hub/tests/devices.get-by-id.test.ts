import { GET } from "../src/app/api/devices/[id]/route";
import { POST } from "../src/app/api/devices/[type]/route";
import { NextRequest } from "next/server";
import { expect, it, describe, beforeEach } from "vitest";
import { devices } from "@hub/lib/deviceStore";

function mockRequest(): NextRequest {
  return {} as unknown as NextRequest;
}

describe("GET /api/devices/[id]", () => {
  beforeEach(() => {
    devices.clear();
  });

  it("returns the device if it exists", async () => {
    // First register a device using POST
    const createReq = {
      name: "Test Light",
      status: { on: true },
    };
    const postRes = await POST(
      {
        json: async () => createReq,
      } as unknown as NextRequest,
      { params: { type: "light" } }
    );
    const created = await postRes.json();

    // Now test GET
    const getRes = await GET(mockRequest(), { params: { id: created.id } });
    const body = await getRes.json();

    expect(getRes.status).toBe(200);
    expect(body).toEqual(created);
  });

  it("returns 404 if device is not found", async () => {
    const res = await GET(mockRequest(), { params: { id: "non-existent-id" } });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe("Device not found");
  });
});