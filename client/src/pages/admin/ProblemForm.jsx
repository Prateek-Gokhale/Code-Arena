import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { problemService } from "../../services/problemService";

const emptyProblem = {
  order: 1,
  title: "",
  slug: "",
  difficulty: "Easy",
  tags: "Array, Hash Table",
  description: "",
  constraints: "1 <= nums.length <= 10^4",
  examples: JSON.stringify([{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "" }], null, 2),
  publicTestCases: JSON.stringify([{ input: "[[2,7,11,15],9]", expectedOutput: "[0,1]" }], null, 2),
  hiddenTestCases: JSON.stringify([{ input: "[[3,2,4],6]", expectedOutput: "[1,2]" }], null, 2),
  starterCode: JSON.stringify({
    javascript: "function solution() {\n  \n}",
    python: "def solution():\n    pass",
    java: "class Solution {\n    public Object solution() {\n        return null;\n    }\n}",
    cpp: "class Solution {\npublic:\n    auto solution() {\n        return 0;\n    }\n};"
  }, null, 2),
  solutionFunction: "solution"
};

export default function ProblemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProblem);
  const editing = Boolean(id);

  useEffect(() => {
    if (!editing) return;
    problemService.adminGet(id).then(({ problem }) => {
      setForm({
        order: problem.order,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: problem.tags.join(", "),
        description: problem.description,
        constraints: problem.constraints.join("\n"),
        examples: JSON.stringify(problem.examples, null, 2),
        publicTestCases: JSON.stringify(problem.publicTestCases, null, 2),
        hiddenTestCases: JSON.stringify(problem.hiddenTestCases, null, 2),
        starterCode: JSON.stringify(problem.starterCode, null, 2),
        solutionFunction: problem.solutionFunction
      });
    });
  }, [editing, id]);

  function update(key, value) {
    const next = key === "title" && !editing ? { ...form, title: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") } : { ...form, [key]: value };
    setForm(next);
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        order: Number(form.order),
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        constraints: form.constraints.split("\n").map((item) => item.trim()).filter(Boolean),
        examples: JSON.parse(form.examples),
        publicTestCases: JSON.parse(form.publicTestCases),
        hiddenTestCases: JSON.parse(form.hiddenTestCases),
        starterCode: JSON.parse(form.starterCode)
      };
      if (editing) await problemService.update(id, payload);
      else await problemService.create(payload);
      toast.success(editing ? "Problem updated" : "Problem created");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Check JSON fields and required inputs");
    }
  }

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div>
        <h1 className="text-2xl font-semibold">{editing ? "Edit problem" : "Add problem"}</h1>
        <p className="mt-1 text-sm text-arena-muted">Hidden test cases are admin-only and never returned to normal problem API responses.</p>
      </div>
      <div className="grid gap-4 rounded border border-arena-line bg-arena-panel p-4 md:grid-cols-2">
        <label className="form-label">Order<input className="input" type="number" value={form.order} onChange={(e) => update("order", e.target.value)} /></label>
        <label className="form-label">Difficulty<select className="input" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        <label className="form-label">Title<input className="input" value={form.title} onChange={(e) => update("title", e.target.value)} required /></label>
        <label className="form-label">Slug<input className="input" value={form.slug} onChange={(e) => update("slug", e.target.value)} required /></label>
        <label className="form-label md:col-span-2">Tags<input className="input" value={form.tags} onChange={(e) => update("tags", e.target.value)} /></label>
        <label className="form-label md:col-span-2">Description<textarea className="input min-h-28" value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
        <label className="form-label">Constraints<textarea className="input min-h-40 font-mono text-xs" value={form.constraints} onChange={(e) => update("constraints", e.target.value)} /></label>
        <label className="form-label">Starter code JSON<textarea className="input min-h-40 font-mono text-xs" value={form.starterCode} onChange={(e) => update("starterCode", e.target.value)} /></label>
        <label className="form-label">Examples JSON<textarea className="input min-h-48 font-mono text-xs" value={form.examples} onChange={(e) => update("examples", e.target.value)} /></label>
        <label className="form-label">Public tests JSON<textarea className="input min-h-48 font-mono text-xs" value={form.publicTestCases} onChange={(e) => update("publicTestCases", e.target.value)} /></label>
        <label className="form-label">Hidden tests JSON<textarea className="input min-h-48 font-mono text-xs" value={form.hiddenTestCases} onChange={(e) => update("hiddenTestCases", e.target.value)} /></label>
        <label className="form-label">Solution function<input className="input" value={form.solutionFunction} onChange={(e) => update("solutionFunction", e.target.value)} /></label>
      </div>
      <div className="flex justify-end gap-2">
        <button className="secondary-button" type="button" onClick={() => navigate("/admin")}>Cancel</button>
        <button className="primary-button" type="submit">{editing ? "Save problem" : "Create problem"}</button>
      </div>
    </form>
  );
}
