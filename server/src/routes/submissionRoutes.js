import { Router } from "express";
import { body } from "express-validator";
import { getSubmission, listSubmissions, runCode, stats, submitCode } from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const executionValidators = [
  body("problemId").isMongoId(),
  body("language").isIn(["javascript", "python", "java", "cpp"]),
  body("code").isString().isLength({ min: 1, max: 50000 }),
  validate
];

router.post("/run", executionValidators, runCode);
router.post("/", protect, executionValidators, submitCode);
router.get("/", protect, listSubmissions);
router.get("/stats", protect, stats);
router.get("/:id", protect, getSubmission);

export default router;
