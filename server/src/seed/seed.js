import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import { Problem } from "../models/Problem.js";
import { User } from "../models/User.js";
import { seedProblems } from "./problems.js";

await connectDB();
await Problem.deleteMany({});
await Problem.insertMany(seedProblems);

const adminEmail = "admin@codearena.dev";
const existingAdmin = await User.findOne({ email: adminEmail });
if (!existingAdmin) {
  await User.create({
    name: "CodeArena Admin",
    email: adminEmail,
    password: "Admin123!",
    role: "admin"
  });
}

console.log(`Seeded ${seedProblems.length} problems`);
console.log("Admin login: admin@codearena.dev / Admin123!");
process.exit(0);
