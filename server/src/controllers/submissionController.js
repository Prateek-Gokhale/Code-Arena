import { Problem } from "../models/Problem.js";
import { Submission } from "../models/Submission.js";
import { executeCode } from "../services/executionService.js";

export async function runCode(req, res, next) {
  try {
    const problem = await Problem.findById(req.body.problemId);
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    const result = await executeCode({
      problem,
      language: req.body.language,
      code: req.body.code,
      tests: problem.publicTestCases
    });
    res.json({ result });
  } catch (error) {
    next(error);
  }
}

export async function submitCode(req, res, next) {
  try {
    const problem = await Problem.findById(req.body.problemId).select("+hiddenTestCases");
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    const tests = [...problem.publicTestCases, ...problem.hiddenTestCases];
    const result = await executeCode({ problem, language: req.body.language, code: req.body.code, tests });
    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      language: req.body.language,
      code: req.body.code,
      ...result
    });
    await Problem.updateOne(
      { _id: problem._id },
      { $inc: { totalSubmissions: 1, acceptedSubmissions: result.status === "Accepted" ? 1 : 0 } }
    );
    res.status(201).json({ submission });
  } catch (error) {
    next(error);
  }
}

export async function listSubmissions(req, res, next) {
  try {
    const query = { user: req.user._id };
    if (req.query.problemId) query.problem = req.query.problemId;
    const submissions = await Submission.find(query).populate("problem", "title slug difficulty").sort({ createdAt: -1 }).limit(100);
    res.json({ submissions });
  } catch (error) {
    next(error);
  }
}

export async function getSubmission(req, res, next) {
  try {
    const submission = await Submission.findOne({ _id: req.params.id, user: req.user._id }).populate("problem", "title slug");
    if (!submission) {
      const error = new Error("Submission not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ submission });
  } catch (error) {
    next(error);
  }
}

export async function stats(req, res, next) {
  try {
    const accepted = await Submission.find({ user: req.user._id, status: "Accepted" }).populate("problem", "difficulty title slug");
    const solvedMap = new Map();
    for (const submission of accepted) solvedMap.set(String(submission.problem?._id), submission.problem);
    const solved = Array.from(solvedMap.values()).filter(Boolean);
    const recentSubmissions = await Submission.find({ user: req.user._id }).populate("problem", "title slug").sort({ createdAt: -1 }).limit(8);
    const all = await Submission.find({ user: req.user._id }).select("createdAt");
    const activityMap = new Map();
    for (let i = 13; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      activityMap.set(date.toISOString().slice(5, 10), 0);
    }
    for (const submission of all) {
      const key = submission.createdAt.toISOString().slice(5, 10);
      if (activityMap.has(key)) activityMap.set(key, activityMap.get(key) + 1);
    }
    res.json({
      totalSolved: solved.length,
      byDifficulty: {
        Easy: solved.filter((problem) => problem.difficulty === "Easy").length,
        Medium: solved.filter((problem) => problem.difficulty === "Medium").length,
        Hard: solved.filter((problem) => problem.difficulty === "Hard").length
      },
      recentSubmissions,
      activity: Array.from(activityMap, ([date, count]) => ({ date, count }))
    });
  } catch (error) {
    next(error);
  }
}
