import { GET } from "../src/app/api/devices/[type]/route";
import { expect, it, describe, beforeEach } from "vitest";
import { devices } from "../src/lib/deviceStore";
import { NextRequest } from "next/server";

function createMockRequest(): NextRequest {
  return {} as NextRequest;
}

describe("GET /api/devices", () => {
  beforeEach(() => {
    devices.clear();
    devices.set("1", {
      id: "1",
      name: "Living Room Light",
      type: "light",
      status: { on: true },
    });
    devices.set("2", {
      id: "2",
      name: "Hallway Thermostat",
      type: "thermostat",
      status: { temperature: 21 },
    });
  });

  it("returns a list of all devices", async () => {
    const req = createMockRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
    expect(body[0]).toHaveProperty("id");
    expect(body[0]).toHaveProperty("name");
    expect(body[0]).toHaveProperty("type");
    expect(body[0]).toHaveProperty("status");
  });

  it("returns an empty list when no devices exist", async () => {
    devices.clear();
    const req = createMockRequest();
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });
});