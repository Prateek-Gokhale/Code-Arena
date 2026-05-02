import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    caseNumber: Number,
    passed: Boolean,
    input: String,
    expectedOutput: String,
    actualOutput: String
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true, index: true },
    language: { type: String, enum: ["javascript", "python", "java", "cpp"], required: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", "Compilation Error"],
      required: true
    },
    runtimeMs: Number,
    memoryKb: Number,
    passedTests: Number,
    totalTests: Number,
    stdout: String,
    error: String,
    testResults: [resultSchema]
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
