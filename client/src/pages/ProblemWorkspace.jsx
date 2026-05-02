import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckCircle2, ChevronLeft, Play, Send, Settings2 } from "lucide-react";
import CodeEditor from "../components/CodeEditor.jsx";
import DifficultyBadge from "../components/DifficultyBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { problemService } from "../services/problemService";
import { submissionService } from "../services/submissionService";
import { timeAgo, statusClass } from "../utils/formatters";

const languages = [
  ["javascript", "JavaScript"],
  ["python", "Python"],
  ["java", "Java"],
  ["cpp", "C++"]
];

export default function ProblemWorkspace() {
  const { slug } = useParams();
  const { theme } = useTheme();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [tab, setTab] = useState("description");
  const [bottomTab, setBottomTab] = useState("tests");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    problemService
      .get(slug)
      .then(({ problem: data }) => {
        setProblem(data);
        const savedLanguage = localStorage.getItem(`codearena_lang_${data.slug}`) || "javascript";
        setLanguage(savedLanguage);
        setCode(localStorage.getItem(`codearena_code_${data.slug}_${savedLanguage}`) || data.starterCode?.[savedLanguage] || "");
      })
      .catch(() => toast.error("Problem not found"));
  }, [slug]);

  useEffect(() => {
    if (problem) localStorage.setItem(`codearena_code_${problem.slug}_${language}`, code);
  }, [code, language, problem]);

  function changeLanguage(nextLanguage) {
    if (!problem) return;
    localStorage.setItem(`codearena_lang_${problem.slug}`, nextLanguage);
    setLanguage(nextLanguage);
    setCode(localStorage.getItem(`codearena_code_${problem.slug}_${nextLanguage}`) || problem.starterCode?.[nextLanguage] || "");
  }

  async function execute(mode) {
    if (!problem) return;
    setBusy(mode);
    setBottomTab("result");
    try {
      const payload = { problemId: problem._id, language, code };
      const response = mode === "run" ? await submissionService.run(payload) : await submissionService.submit(payload);
      setResult(response.result || response.submission);
      toast.success(mode === "run" ? "Sample tests completed" : "Submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Execution failed");
    } finally {
      setBusy("");
    }
  }

  const submissions = useMemo(() => problem?.recentSubmissions || [], [problem]);

  if (!problem) return <div className="screen-loader">Loading workspace...</div>;

  return (
    <main className="workspace">
      <section className="workspace-panel min-w-0">
        <div className="flex items-center gap-3 border-b border-arena-line px-4 py-3">
          <Link to="/problems" className="icon-button"><ChevronLeft size={18} /></Link>
          <div>
            <h1 className="font-semibold">{problem.order}. {problem.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-arena-muted">
              <DifficultyBadge difficulty={problem.difficulty} />
              <span>{problem.acceptanceRate}% acceptance</span>
              {problem.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
            </div>
          </div>
        </div>
        <div className="tabs">
          {["description", "submissions"].map((item) => (
            <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {tab === "description" && (
            <article className="prose-arena">
              <p>{problem.description}</p>
              <h3>Examples</h3>
              {problem.examples.map((example, index) => (
                <div className="example" key={index}>
                  <p><b>Input:</b> {example.input}</p>
                  <p><b>Output:</b> {example.output}</p>
                  {example.explanation && <p><b>Explanation:</b> {example.explanation}</p>}
                </div>
              ))}
              <h3>Constraints</h3>
              <ul>{problem.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
            </article>
          )}
          {tab === "submissions" && (
            <div className="space-y-3">
              {submissions.length === 0 && <EmptyState title="No submissions yet" body="Submit a solution to see history for this problem." />}
              {submissions.map((entry) => (
                <div className="rounded border border-arena-line p-3" key={entry._id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={statusClass[entry.status] || ""}>{entry.status}</span>
                    <span className="text-xs text-arena-muted">{timeAgo(entry.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-xs text-arena-muted">{entry.language} · {entry.runtimeMs || "-"} ms · {entry.memoryKb ? `${entry.memoryKb} KB` : "-"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="workspace-panel min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-arena-line px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Settings2 size={16} className="text-arena-muted" />
            <select className="input h-9 w-40" value={language} onChange={(e) => changeLanguage(e.target.value)}>
              {languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <button className="secondary-button" onClick={() => setCode(problem.starterCode?.[language] || "")}>Reset</button>
        </div>
        <div className="min-h-[360px] flex-1">
          <CodeEditor language={language} value={code} onChange={setCode} theme={theme} />
        </div>
        <div className="flex items-center justify-end gap-2 border-y border-arena-line p-3">
          <button className="secondary-button" disabled={!!busy} onClick={() => execute("run")}><Play size={16} /> {busy === "run" ? "Running..." : "Run"}</button>
          <button className="primary-button" disabled={!!busy} onClick={() => execute("submit")}><Send size={16} /> {busy === "submit" ? "Submitting..." : "Submit"}</button>
        </div>
        <div className="h-[260px] min-h-0">
          <div className="tabs">
            {["tests", "result", "console"].map((item) => <button key={item} className={bottomTab === item ? "active" : ""} onClick={() => setBottomTab(item)}>{item}</button>)}
          </div>
          <div className="h-[210px] overflow-auto p-4 text-sm">
            {bottomTab === "tests" && problem.publicTestCases.map((test, index) => (
              <div className="example mb-3" key={index}>
                <p><b>Case {index + 1}</b></p>
                <p>Input: {test.input}</p>
                <p>Expected: {test.expectedOutput}</p>
              </div>
            ))}
            {bottomTab === "result" && !result && <p className="text-arena-muted">Run or submit code to see verdict, runtime, memory, and console details.</p>}
            {bottomTab === "result" && result && (
              <div>
                <p className={`flex items-center gap-2 text-lg font-semibold ${statusClass[result.status] || ""}`}><CheckCircle2 size={20} /> {result.status}</p>
                <p className="mt-2 text-arena-muted">Passed {result.passedTests}/{result.totalTests} tests · {result.runtimeMs || "-"} ms · {result.memoryKb || "-"} KB</p>
                <div className="mt-3 grid gap-2">
                  {(result.testResults || []).map((test) => (
                    <div className="rounded border border-arena-line p-3" key={test.caseNumber}>
                      <p className={test.passed ? "text-emerald-500" : "text-red-500"}>Case {test.caseNumber}: {test.passed ? "Passed" : "Failed"}</p>
                      {!test.passed && <p className="mt-1 text-arena-muted">Expected {test.expectedOutput}, got {test.actualOutput}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {bottomTab === "console" && <pre className="whitespace-pre-wrap text-arena-muted">{result?.stdout || result?.error || "Console output appears here."}</pre>}
          </div>
        </div>
      </section>
    </main>
  );
}
