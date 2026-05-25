import { findAll, findById, getHistoryById, save } from "../store/monitorStore";
import {
  Monitor,
  SafeMonitor,
  MonitorSummary,
  CreateMonitorDto,
  AlertEvent,
} from "../types/monitor.types";

// Strip timerHandle before sending data outside the service layer
function toSafeMonitor(monitor: Monitor): SafeMonitor {
  const { timerHandler, ...safe } = monitor;
  return safe;
}

function toMonitorSummary(monitor: Monitor): MonitorSummary {
  const { timerHandler, alertHistory, ...summary } = monitor;
  return summary;
}

function fireAlert(id: string): void {
  const monitor = findById(id);
  if (!monitor) return;

  const event: AlertEvent = {
    time: new Date().toISOString(),
    message: `Monitor ${id} failed to heartbeat within ${monitor.timeout}s`,
    resolvedAt: null,
    offlineDuration: "ongoing",
  };

  monitor.alertHistory.push(event);
  monitor.status = "down";
  monitor.timerHandler = null;

  console.log(
    JSON.stringify({
      ALERT: `Device ${id} is down!`,
      alertEmail: monitor.alertEmail,
      time: new Date().toISOString(),
    }),
  );
}

function startTimer(monitor: Monitor): void {
  // Always clear any existing timer before starting a new one
  if (monitor.timerHandler) clearTimeout(monitor.timerHandler);
  monitor.timerHandler = setTimeout(
    () => fireAlert(monitor.id),
    monitor.timeout * 1000,
  );
}

export function createMonitor(dto: CreateMonitorDto): SafeMonitor {
  // If monitor already exists, cancel its timer before overwriting
  const existing = findById(dto.id);
  if (existing?.timerHandler) clearTimeout(existing.timerHandler);

  const monitor: Monitor = {
    id: dto.id,
    timeout: dto.timeout,
    alertEmail: dto.alertEmail,
    status: "active",
    lastHeartbeat: new Date().toISOString(),
    timerHandler: null,
    alertHistory: [],
  };

  startTimer(monitor);
  save(monitor);
  return toSafeMonitor(monitor);
}

export function heartbeatOfMonitor(id: string): MonitorSummary | null {
  const monitor = findById(id);
  if (!monitor) return null;

  if (monitor.status === "down") {
    const lastAlert = monitor.alertHistory[monitor.alertHistory.length - 1];

    if (lastAlert && !lastAlert.resolvedAt) {
      lastAlert.resolvedAt = new Date().toISOString();

      const downTimeInSeconds = Math.floor(
        (new Date(lastAlert.time).getTime() -
          new Date(lastAlert.resolvedAt).getTime()) /
          1000,
      );

      lastAlert.offlineDuration = `${downTimeInSeconds}'s`;
    }
  }

  startTimer(monitor);
  monitor.status = "active";
  monitor.lastHeartbeat = new Date().toISOString();

  return toMonitorSummary(monitor);
}

export function pauseMonitor(id: string): MonitorSummary | null {
  const monitor = findById(id);
  if (!monitor) return null;

  if (monitor.timerHandler) clearTimeout(monitor.timerHandler);
  monitor.timerHandler = null;
  monitor.status = "paused";

  return toMonitorSummary(monitor);
}

export function getMonitor(id: string): SafeMonitor | null {
  const monitor = findById(id);
  return monitor ? toSafeMonitor(monitor) : null;
}

export function getAllMonitors(): SafeMonitor[] {
  return findAll().map(toSafeMonitor);
}

export function getMonitorHistory(id: string): AlertEvent[] | null {
  return getHistoryById(id);
}
