import { Request, response, Response } from "express";
import {
  createMonitor,
  heartbeatOfMonitor,
  pauseMonitor,
  getMonitor,
  getAllMonitors,
  getMonitorHistory,
} from "../services/monitorServices";
import { CreateMonitorDto } from "../types/monitor.types";
import { findById } from "../store/monitorStore";

export function create(req: Request, res: Response): void {
  const { id, timeout, alertEmail } = req.body as CreateMonitorDto;

  if (!id || !timeout || !alertEmail) {
    res
      .status(400)
      .json({ error: "id, timeout, and alert email are required" });
    return;
  }

  const monitor = createMonitor({ id, timeout, alertEmail });
  res.status(201).json({ message: `Monitor for ${id} created`, monitor });
}

export function heartbeat(req: Request, res: Response): void {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const monitor = heartbeatOfMonitor(id);

  if (!monitor) {
    res.status(404).json({ error: `Monitor ${id} not found` });
    return;
  }

  res.status(200).json({ message: `Heartbeat received for ${id}`, monitor });
}

export function pause(req: Request, res: Response): void {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const mon = findById(id);

  if (mon?.status === "down") {
    res
      .status(403)
      .json({ message: `Monitor ${id} is already down, can't pause` });
    return;
  }

  const monitor = pauseMonitor(id);

  if (!monitor) {
    res.status(404).json({ error: `Monitor ${id} not found` });
    return;
  }

  res.status(200).json({ message: `Monitor ${id} paused`, monitor });
}

export function getOne(req: Request, res: Response): void {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const monitor = getMonitor(id);

  if (!monitor) {
    res.status(404).json({ error: `Monitor ${id} not found` });
    return;
  }

  res.status(200).json(monitor);
}

export function getAll(req: Request, res: Response): void {
  const monitors = getAllMonitors();
  res.status(200).json(monitors);
}

export function getHistory(req: Request, res: Response): void {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const history = getMonitorHistory(id);

  if (!history) {
    res.status(404).json({ error: `Monitor ${id} not found` });
    return;
  }

  //   const formattedHistory = history.map((alert) => {
  //     if (!alert.resolvedAt) {
  //       return { ...alert };
  //     }

  //     const downAt = new Date(alert.time).getTime();
  //     const resolvedAt = new Date(alert.resolvedAt).getTime();
  //     const downTimeInSeconds = Math.floor((resolvedAt - downAt) / 1000);
  //     alert.offlineDuration = `${downTimeInSeconds}s`;
  //     return alert;
  //   });

  res.status(200).json({
    id,
    totalAlerts: history.length,
    history: history,
  });
}
