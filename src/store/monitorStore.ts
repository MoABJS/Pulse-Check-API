import { Monitor } from "../types/monitor.types";

const monitors = new Map<string, Monitor>();

export function save(monitor: Monitor): void {
  monitors.set(monitor.id, monitor);
}

export function findById(id: string): Monitor | undefined {
  return monitors.get(id);
}

export function findAll(): Monitor[] {
  return Array.from(monitors.values());
}

export function getHistoryById(id: string): Monitor["alertHistory"] | null {
  const monitor = monitors.get(id);
  return monitor ? monitor.alertHistory : null;
}
