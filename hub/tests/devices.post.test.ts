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
});