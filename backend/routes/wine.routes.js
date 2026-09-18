import express from "express";
import {
  getWines,
  getWineById,
  seedWinesEndpoint,
} from "../controllers/wine.controller.js";

const router = express.Router();

router.get("/", getWines);
router.get("/:id", getWineById);
router.post("/seed", seedWinesEndpoint);

export default router;
