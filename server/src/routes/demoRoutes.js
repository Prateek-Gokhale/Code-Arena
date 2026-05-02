import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { seedProblems } from "../seed/problems.js";
import { executeCode } from "../services/executionService.js";
import { signToken } from "../services/tokenService.js";

const router = Router();
const users = [
  {
    id: "admin-demo",
    name: "CodeArena Admin",
    email: "admin@codearena.dev",
    passwordHash: bcrypt.hashSync("Admin123!", 10),
    role: "admin"
  }
];
const submissions = [];

const publicProblem = (problem) => ({
  ...problem,
  _id: problem.slug,
  id: problem.slug,
  hiddenTestCases: undefined,
  totalSubmissions: submissions.filter((submission) => submission.problem === problem.slug).length,
  acceptedSubmissions: submissions.filter((submission) => submission.problem === problem.slug && submission.status === "Accepted").length,
  acceptanceRate: 0
});

function getUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "codearena-demo-secret");
    return users.find((user) => user.id === decoded.id) || null;
  } catch {
    return null;
  }
}

function userPayload(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function requireUser(req, res, next) {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required" });
  req.user = user;
  next();
}

router.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(422).json({ message: "Name, valid email, and 6+ character password are required" });
  }
  if (users.some((user) => user.email === email.toLowerCase())) {
    return res.status(409).json({ message: "Email is already registered" });
  }
  const user = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    role: "user"
  };
  users.push(user);
  res.status(201).json({ token: signToken(user), user: userPayload(user) });
});

router.post("/auth/login", async (req, res) => {
  const user = users.find((entry) => entry.email === String(req.body.email || "").toLowerCase());
  if (!user || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: signToken(user), user: userPayload(user) });
});

router.get("/auth/me", requireUser, (req, res) => {
  res.json({ user: userPayload(req.user) });
});

router.get("/problems", (req, res) => {
  const user = getUser(req);
  const search = String(req.query.search || "").toLowerCase();
  const problems = seedProblems
    .filter((problem) => !req.query.difficulty || problem.difficulty === req.query.difficulty)
    .filter((problem) => !req.query.tag || problem.tags.includes(req.query.tag))
    .filter((problem) => !search || problem.title.toLowerCase().includes(search) || problem.tags.some((tag) => tag.toLowerCase().includes(search)))
    .map((problem) => {
      const userSubs = user ? submissions.filter((submission) => submission.user === user.id && submission.problem === problem.slug) : [];
      const solved = userSubs.some((submission) => submission.status === "Accepted");
      return { ...publicProblem(problem), userStatus: solved ? "Solved" : userSubs.length ? "Attempted" : "Unsolved" };
    });
  res.json({ problems });
});

router.get("/problems/:slug", (req, res) => {
  const problem = seedProblems.find((entry) => entry.slug === req.params.slug);
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  const user = getUser(req);
  const recentSubmissions = user ? submissions.filter((submission) => submission.user === user.id && submission.problem === problem.slug).slice(0, 12) : [];
  res.json({ problem: { ...publicProblem(problem), recentSubmissions } });
});

router.post("/submissions/run", async (req, res) => {
  const problem = seedProblems.find((entry) => entry.slug === req.body.problemId || entry.slug === req.body.problemId?.toString());
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  const result = await executeCode({ problem, language: req.body.language, code: req.body.code, tests: problem.publicTestCases });
  res.json({ result });
});

router.post("/submissions", requireUser, async (req, res) => {
  const problem = seedProblems.find((entry) => entry.slug === req.body.problemId || entry.slug === req.body.problemId?.toString());
  if (!problem) return res.status(404).json({ message: "Problem not found" });
  const result = await executeCode({
    problem,
    language: req.body.language,
    code: req.body.code,
    tests: [...problem.publicTestCases, ...problem.hiddenTestCases]
  });
  const submission = {
    _id: `sub-${Date.now()}`,
    user: req.user.id,
    problem: problem.slug,
    language: req.body.language,
    code: req.body.code,
    createdAt: new Date().toISOString(),
    ...result
  };
  submissions.unshift(submission);
  res.status(201).json({ submission });
});

router.get("/submissions", requireUser, (req, res) => {
  res.json({
    submissions: submissions
      .filter((submission) => submission.user === req.user.id)
      .map((submission) => ({ ...submission, problem: seedProblems.find((problem) => problem.slug === submission.problem) }))
  });
});

router.get("/submissions/stats", requireUser, (req, res) => {
  const mine = submissions.filter((submission) => submission.user === req.user.id);
  const solvedSlugs = new Set(mine.filter((submission) => submission.status === "Accepted").map((submission) => submission.problem));
  const solvedProblems = seedProblems.filter((problem) => solvedSlugs.has(problem.slug));
  const activity = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key.slice(5), count: mine.filter((submission) => submission.createdAt.slice(0, 10) === key).length };
  });
  res.json({
    totalSolved: solvedProblems.length,
    byDifficulty: {
      Easy: solvedProblems.filter((problem) => problem.difficulty === "Easy").length,
      Medium: solvedProblems.filter((problem) => problem.difficulty === "Medium").length,
      Hard: solvedProblems.filter((problem) => problem.difficulty === "Hard").length
    },
    recentSubmissions: mine.slice(0, 8).map((submission) => ({ ...submission, problem: seedProblems.find((problem) => problem.slug === submission.problem) })),
    activity
  });
});

export default router;
