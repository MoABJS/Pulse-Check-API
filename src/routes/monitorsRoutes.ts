import { Router } from "express";
import {
  create,
  heartbeat,
  pause,
  getOne,
  getAll,
} from "../controllers/monitorController";

const router = Router();

router.post("/monitors", create);
router.post("/monitors/:id/heartbeat", heartbeat);
router.post("/monitors/:id/pause", pause);
router.get("/monitors/:id", getOne);
router.get("/monitors", getAll);

export default router;
