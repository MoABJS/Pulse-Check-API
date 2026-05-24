export interface Monitor {
  id: string;
  timeout: number;
  alertEmail: string;
  status: "active" | "paused" | "down";
  lastHeartbeat: string;
  timerHandle: ReturnType<typeof setTimeout> | null;
}

export type SafeMonitor = Omit<Monitor, "timerHandle">;

// Shape of the request body for POST /monitors
export interface CreateMonitorDto {
  id: string;
  timeout: number;
  alertEmail: string;
}
