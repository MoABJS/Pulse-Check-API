export interface Monitor {
  id: string;
  timeout: number;
  alertEmail: string;
  status: "active" | "paused" | "down";
  lastHeartbeat: string;
  timerHandler: ReturnType<typeof setTimeout> | null;
  alertHistory: AlertEvent[];
}

export interface AlertEvent {
  alertTime: string;
  message: string;
  resolvedAt: string | null;
  offlineDuration: string;
}

export type SafeMonitor = Omit<Monitor, "timerHandler">;

export type MonitorSummary = Omit<SafeMonitor, "alertHistory">;

export interface CreateMonitorDto {
  id: string;
  timeout: number;
  alertEmail: string;
}
