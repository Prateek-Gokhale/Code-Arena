import { User } from "../models/User.js";
import { signToken } from "../services/tokenService.js";

function authPayload(user) {
  return {
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  };
}

export async function register(req, res, next) {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }
    const user = await User.create(req.body);
    res.status(201).json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+password");
    if (!user || !(await user.comparePassword(req.body.password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
    res.json(authPayload(user));
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
}
