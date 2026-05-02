import { Problem } from "../models/Problem.js";

export async function adminListProblems(_req, res, next) {
  try {
    const problems = await Problem.find({}).select("+hiddenTestCases").sort({ order: 1 });
    res.json({
      problems: problems.map((problem) => ({
        ...problem.toJSON(),
        hiddenTestCount: problem.hiddenTestCases?.length || 0
      }))
    });
  } catch (error) {
    next(error);
  }
}

export async function adminGetProblem(req, res, next) {
  try {
    const problem = await Problem.findById(req.params.id).select("+hiddenTestCases");
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ problem });
  } catch (error) {
    next(error);
  }
}

export async function createProblem(req, res, next) {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ problem });
  } catch (error) {
    next(error);
  }
}

export async function updateProblem(req, res, next) {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select("+hiddenTestCases");
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ problem });
  } catch (error) {
    next(error);
  }
}

export async function deleteProblem(req, res, next) {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }
    res.json({ message: "Problem deleted" });
  } catch (error) {
    next(error);
  }
}
