import { findAll, findById, save } from "../store/monitorStore";
import { Monitor, SafeMonitor, CreateMonitorDto } from "../types/monitor.types";

// Strip timerHandle before sending data outside the service layer
function toSafeMonitor(monitor: Monitor): SafeMonitor {
  const { timerHandle, ...safe } = monitor;
  return safe;
}

function fireAlert(id: string): void {
  const monitor = findById(id);
  if (!monitor) return;

  monitor.status = "down";
  monitor.timerHandle = null;

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
  if (monitor.timerHandle) clearTimeout(monitor.timerHandle);
  monitor.timerHandle = setTimeout(
    () => fireAlert(monitor.id),
    monitor.timeout * 1000,
  );
}

export function createMonitor(dto: CreateMonitorDto): SafeMonitor {
  // If monitor already exists, cancel its timer before overwriting
  const existing = findById(dto.id);
  if (existing?.timerHandle) clearTimeout(existing.timerHandle);

  const monitor: Monitor = {
    id: dto.id,
    timeout: dto.timeout,
    alertEmail: dto.alertEmail,
    status: "active",
    lastHeartbeat: new Date().toISOString(),
    timerHandle: null,
  };

  startTimer(monitor);
  save(monitor);
  return toSafeMonitor(monitor);
}

export function heartbeatOfMonitor(id: string): SafeMonitor | null {
  const monitor = findById(id);
  if (!monitor) return null;

  startTimer(monitor);
  monitor.status = "active";
  monitor.lastHeartbeat = new Date().toISOString();

  return toSafeMonitor(monitor);
}

export function pauseMonitor(id: string): SafeMonitor | null {
  const monitor = findById(id);
  if (!monitor) return null;

  // A down monitor can't be paused
  // if (monitor.status === "down") return toSafeMonitor(monitor);

  if (monitor.timerHandle) clearTimeout(monitor.timerHandle);
  monitor.timerHandle = null;
  monitor.status = "paused";

  return toSafeMonitor(monitor);
}

export function getMonitor(id: string): SafeMonitor | null {
  const monitor = findById(id);
  return monitor ? toSafeMonitor(monitor) : null;
}

export function getAllMonitors(): SafeMonitor[] {
  return findAll().map(toSafeMonitor);
}
