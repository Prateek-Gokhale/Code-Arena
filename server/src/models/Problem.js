import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  { input: String, output: String, explanation: String },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  { input: { type: String, required: true }, expectedOutput: { type: String, required: true } },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    tags: [{ type: String, trim: true }],
    description: { type: String, required: true },
    examples: [exampleSchema],
    constraints: [String],
    starterCode: {
      javascript: String,
      python: String,
      java: String,
      cpp: String
    },
    solutionFunction: { type: String, default: "solution" },
    publicTestCases: [testCaseSchema],
    hiddenTestCases: { type: [testCaseSchema], select: false },
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

problemSchema.virtual("acceptanceRate").get(function acceptanceRate() {
  if (!this.totalSubmissions) return 0;
  return Math.round((this.acceptedSubmissions / this.totalSubmissions) * 100);
});

problemSchema.set("toJSON", { virtuals: true });
problemSchema.set("toObject", { virtuals: true });

export const Problem = mongoose.model("Problem", problemSchema);
