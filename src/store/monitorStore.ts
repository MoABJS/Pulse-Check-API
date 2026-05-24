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

export function exists(id: string): boolean {
  return monitors.has(id);
}
