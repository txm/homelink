import { z } from "zod";

export const deviceInputSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  type: z.enum(["light", "thermostat", "camera"]),
  status: z.any(),
});
