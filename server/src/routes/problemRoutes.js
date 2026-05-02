import { Router } from "express";
import { getProblem, listProblems } from "../controllers/problemController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", optionalProtect, listProblems);
router.get("/:slug", optionalProtect, getProblem);

export default router;
