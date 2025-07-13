export type Device = {
  id: string;
  name: string;
  type: "light" | "thermostat" | "camera";
  status: any;
};