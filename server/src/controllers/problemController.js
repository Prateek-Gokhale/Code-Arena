import { Problem } from "../models/Problem.js";
import { Submission } from "../models/Submission.js";

export async function listProblems(req, res, next) {
  try {
    const query = { isPublished: true };
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.tag) query.tags = req.query.tag;
    if (req.query.search) query.$or = [
      { title: new RegExp(req.query.search, "i") },
      { tags: new RegExp(req.query.search, "i") }
    ];

    const problems = await Problem.find(query).sort({ order: 1 });
    let statusByProblem = new Map();
    if (req.user) {
      const submissions = await Submission.find({ user: req.user._id }).select("problem status");
      statusByProblem = submissions.reduce((map, sub) => {
        const key = String(sub.problem);
        if (sub.status === "Accepted") map.set(key, "Solved");
        else if (!map.has(key)) map.set(key, "Attempted");
        return map;
      }, new Map());
    }
    res.json({ problems: problems.map((problem) => ({ ...problem.toJSON(), userStatus: statusByProblem.get(String(problem._id)) || "Unsolved" })) });
  } catch (error) {
    next(error);
  }
}

export async function getProblem(req, res, next) {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug, isPublished: true });
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    const recentSubmissions = req.user
      ? await Submission.find({ user: req.user._id, problem: problem._id }).sort({ createdAt: -1 }).limit(12)
      : [];
    res.json({ problem: { ...problem.toJSON(), recentSubmissions } });
  } catch (error) {
    next(error);
  }
}
