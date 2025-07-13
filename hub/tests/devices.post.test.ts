import { POST } from "../src/app/api/devices/[type]/route";
import { NextRequest } from "next/server";
import { expect, it, describe } from "vitest";

function mockRequest(json: any): NextRequest {
  return {
    json: async () => json,
  } as unknown as NextRequest;
}

describe("POST /api/devices/[type]", () => {
  it("registers a light device successfully", async () => {
    const req = mockRequest({
      name: "Test Light",
      status: { on: true },
    });

    const res = await POST(req, { params: { type: "light" } });
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body.name).toBe("Test Light");
    expect(body.type).toBe("light");
    expect(body.status).toEqual({ on: true });
  });

  it("rejects invalid device type", async () => {
    const req = mockRequest({
      name: "Bad Device",
      status: {},
    });

    const res = await POST(req, { params: { type: "toaster" } });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Invalid device type");
  });

  it("rejects missing name", async () => {
    const req = mockRequest({
      status: { temp: 22 },
    });

    const res = await POST(req, { params: { type: "thermostat" } });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
    expect(body.error.name?._errors?.[0]).toMatch(/required/i);
  });

  it("rejects non-string name", async () => {
    const req = mockRequest({
      name: 42,
      status: { on: true },
    });

    const res = await POST(req, { params: { type: "light" } });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
  });

  it("requires status field", async () => {
    const req = mockRequest({
      name: "Incomplete Device",
    });

    const res = await POST(req, { params: { type: "camera" } });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBeDefined();
  });

  it.each(["light", "thermostat", "camera"] as const)(
    "registers a %s device with basic status",
    async (type) => {
      const req = mockRequest({
        name: `Auto Device: ${type}`,
        status: { ok: true },
      });

      const res = await POST(req, { params: { type } });
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body.type).toBe(type);
    }
  );
});