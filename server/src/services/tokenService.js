import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET || "codearena-demo-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}
