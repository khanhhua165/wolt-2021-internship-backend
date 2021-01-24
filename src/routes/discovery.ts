import { Router } from "express";
import getDiscovery from "../controllers/discovery";

const router = Router();

router.get("/discovery", getDiscovery);

export default router;
