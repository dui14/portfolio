import type { Metric } from "../domain/metric.ts";

export const metrics: Metric[] = [
  { id: "trades", value: 10, suffix: "K+" },
  { id: "users", value: 100, suffix: "+" },
  { id: "integrations", value: 20, suffix: "+" },
];
