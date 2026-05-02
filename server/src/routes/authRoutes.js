import { Router } from "express";
import { body } from "express-validator";
import { login, me, register } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  body("name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  validate,
  register
);

router.post("/login", body("email").isEmail().normalizeEmail(), body("password").notEmpty(), validate, login);
router.get("/me", protect, me);

export default router;
