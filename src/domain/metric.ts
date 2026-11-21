export type MetricId = "trades" | "users" | "integrations";

export type Metric = {
  id: MetricId;
  value: number;
  suffix?: string;
};
