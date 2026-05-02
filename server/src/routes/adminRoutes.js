import { Router } from "express";
import { body } from "express-validator";
import { adminGetProblem, adminListProblems, createProblem, deleteProblem, updateProblem } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect, adminOnly);

const problemValidators = [
  body("order").isNumeric(),
  body("title").trim().notEmpty(),
  body("slug").trim().notEmpty(),
  body("difficulty").isIn(["Easy", "Medium", "Hard"]),
  body("description").trim().notEmpty(),
  body("starterCode").isObject(),
  body("publicTestCases").isArray({ min: 1 }),
  body("hiddenTestCases").isArray({ min: 1 }),
  validate
];

router.get("/problems", adminListProblems);
router.get("/problems/:id", adminGetProblem);
router.post("/problems", problemValidators, createProblem);
router.put("/problems/:id", problemValidators, updateProblem);
router.delete("/problems/:id", deleteProblem);

export default router;
