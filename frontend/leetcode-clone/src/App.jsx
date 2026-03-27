import { useEffect, useMemo, useState } from "react";
import { ALL_TAGS, PROBLEMS } from "./problems";
import { evaluateSolution, formatValue } from "./evaluator";

const STORAGE_KEY = "algo_arena_state_v1";
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const DIFFICULTY_CLASS = {
  Easy: "difficulty-easy",
  Medium: "difficulty-medium",
  Hard: "difficulty-hard"
};

const createSubmissionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const formatDateTime = (isoDate) => {
  try {
    return new Date(isoDate).toLocaleString();
  } catch (error) {
    return isoDate;
  }
};

const getStatusClass = (status) => {
  if (status === "Accepted" || status === "Passed") {
    return "status-pass";
  }
  if (status === "Compile Error") {
    return "status-compile";
  }
  return "status-fail";
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [selectedProblemId, setSelectedProblemId] = useState(PROBLEMS[0]?.id ?? 0);
  const [drafts, setDrafts] = useState(() => {
    const firstProblem = PROBLEMS[0];
    if (!firstProblem) {
      return {};
    }
    return {
      [firstProblem.id]: firstProblem.starterCode
    };
  });
  const [submissions, setSubmissions] = useState([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    try {
      const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (!savedState) {
        return;
      }

      if (savedState.drafts && typeof savedState.drafts === "object") {
        setDrafts(savedState.drafts);
      }
      if (Array.isArray(savedState.submissions)) {
        setSubmissions(savedState.submissions);
      }
      if (Array.isArray(savedState.solvedProblemIds)) {
        setSolvedProblemIds(savedState.solvedProblemIds);
      }
      if (Number.isInteger(savedState.selectedProblemId)) {
        setSelectedProblemId(savedState.selectedProblemId);
      }
    } catch (error) {
      console.error("Failed to load saved state", error);
    }
  }, []);

  useEffect(() => {
    const payload = {
      drafts,
      submissions,
      solvedProblemIds,
      selectedProblemId
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [drafts, submissions, solvedProblemIds, selectedProblemId]);

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((problem) => {
      const matchesSearch = `${problem.id}. ${problem.title}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      const matchesTag = tagFilter === "All" || problem.tags.includes(tagFilter);
      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [searchTerm, difficultyFilter, tagFilter]);

  useEffect(() => {
    if (!filteredProblems.length) {
      return;
    }
    const existsInFiltered = filteredProblems.some(
      (problem) => problem.id === selectedProblemId
    );
    if (!existsInFiltered) {
      setSelectedProblemId(filteredProblems[0].id);
    }
  }, [filteredProblems, selectedProblemId]);

  const selectedProblem = useMemo(() => {
    return (
      PROBLEMS.find((problem) => problem.id === selectedProblemId) ??
      filteredProblems[0] ??
      PROBLEMS[0]
    );
  }, [selectedProblemId, filteredProblems]);

  useEffect(() => {
    if (!selectedProblem) {
      return;
    }
    setDrafts((previous) => {
      if (previous[selectedProblem.id]) {
        return previous;
      }
      return {
        ...previous,
        [selectedProblem.id]: selectedProblem.starterCode
      };
    });
  }, [selectedProblem]);

  const currentCode = selectedProblem
    ? drafts[selectedProblem.id] ?? selectedProblem.starterCode
    : "";

  const currentProblemSubmissions = useMemo(() => {
    if (!selectedProblem) {
      return [];
    }
    return submissions
      .filter((entry) => entry.problemId === selectedProblem.id)
      .slice(0, 8);
  }, [submissions, selectedProblem]);

  const solvedCount = solvedProblemIds.length;

  const runEvaluation = (mode) => {
    if (!selectedProblem) {
      return;
    }

    const tests = mode === "run" ? selectedProblem.sampleTests : selectedProblem.hiddenTests;
    const output = evaluateSolution(selectedProblem, currentCode, tests);

    if (output.compileError) {
      setResult({
        mode,
        status: "Compile Error",
        compileError: output.compileError
      });
      return;
    }

    const passedAll = output.passedCount === output.total;
    const runtimeMs =
      mode === "submit"
        ? Math.round((output.elapsedMs + Math.random() * 3) * 100) / 100
        : output.elapsedMs;
    const memoryMb = Math.round((34 + Math.random() * 26) * 100) / 100;

    if (mode === "submit") {
      const status = passedAll ? "Accepted" : "Wrong Answer";
      const submission = {
        id: createSubmissionId(),
        problemId: selectedProblem.id,
        title: selectedProblem.title,
        status,
        runtimeMs,
        memoryMb,
        passedCount: output.passedCount,
        total: output.total,
        submittedAt: new Date().toISOString()
      };

      setSubmissions((previous) => [submission, ...previous].slice(0, 200));

      if (passedAll) {
        setSolvedProblemIds((previous) => {
          if (previous.includes(selectedProblem.id)) {
            return previous;
          }
          return [...previous, selectedProblem.id];
        });
      }
    }

    setResult({
      mode,
      status: passedAll ? (mode === "run" ? "Passed" : "Accepted") : "Failed",
      compileError: null,
      runtimeMs,
      memoryMb,
      passedCount: output.passedCount,
      total: output.total,
      caseResults: output.caseResults,
      firstFailure: output.caseResults.find((entry) => !entry.passed) ?? null
    });
  };

  const handleProblemSelect = (problemId) => {
    setSelectedProblemId(problemId);
    setResult(null);
  };

  const handleCodeReset = () => {
    if (!selectedProblem) {
      return;
    }
    setDrafts((previous) => ({
      ...previous,
      [selectedProblem.id]: selectedProblem.starterCode
    }));
    setResult(null);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Interview Practice Platform</p>
          <h1>AlgoArena</h1>
        </div>
        <div className="topbar-metrics">
          <div className="metric-card">
            <p>Solved</p>
            <strong>
              {solvedCount} / {PROBLEMS.length}
            </strong>
          </div>
          <div className="metric-card">
            <p>Recent Submissions</p>
            <strong>{submissions.length}</strong>
          </div>
        </div>
      </header>

      <div className="workspace-grid">
        <aside className="problem-sidebar">
          <div className="panel-header">
            <h2>Problems</h2>
            <span>{filteredProblems.length} shown</span>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search by title or number"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <div className="filter-row">
              <select
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value)}
              >
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>

              <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
                <option value="All">All Tags</option>
                {ALL_TAGS.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="problem-list">
            {filteredProblems.length === 0 && (
              <div className="empty-list">No problems match your filters.</div>
            )}

            {filteredProblems.map((problem) => {
              const solved = solvedProblemIds.includes(problem.id);
              const active = selectedProblem?.id === problem.id;
              return (
                <button
                  key={problem.id}
                  type="button"
                  className={`problem-row ${active ? "active" : ""}`}
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  <div className="problem-row-top">
                    <strong>
                      {problem.id}. {problem.title}
                    </strong>
                    <span className={`badge ${DIFFICULTY_CLASS[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="problem-row-bottom">
                    <span>{problem.acceptance} acceptance</span>
                    <span>{solved ? "Solved" : "Unsolved"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="main-pane">
          {!selectedProblem && (
            <section className="card">
              <h2>No problem selected</h2>
            </section>
          )}

          {selectedProblem && (
            <>
              <section className="problem-banner card">
                <div>
                  <p className="eyebrow">#{selectedProblem.id}</p>
                  <h2>{selectedProblem.title}</h2>
                  <div className="tag-row">
                    <span className={`badge ${DIFFICULTY_CLASS[selectedProblem.difficulty]}`}>
                      {selectedProblem.difficulty}
                    </span>
                    {selectedProblem.tags.map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="function-meta">
                  <p>Function to implement</p>
                  <code>{selectedProblem.functionName}(...args)</code>
                </div>
              </section>

              <div className="content-grid">
                <section className="left-column">
                  <article className="card">
                    <h3>Description</h3>
                    <p>{selectedProblem.description}</p>

                    <h4>Examples</h4>
                    <div className="examples">
                      {selectedProblem.examples.map((example, index) => (
                        <div className="example" key={`${selectedProblem.id}-example-${index}`}>
                          <p>
                            <strong>Input:</strong> {example.input}
                          </p>
                          <p>
                            <strong>Output:</strong> {example.output}
                          </p>
                          <p>
                            <strong>Explanation:</strong> {example.explanation}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h4>Constraints</h4>
                    <ul className="constraints">
                      {selectedProblem.constraints.map((constraint) => (
                        <li key={constraint}>{constraint}</li>
                      ))}
                    </ul>
                  </article>

                  <article className="card">
                    <h3>Submission History</h3>
                    {currentProblemSubmissions.length === 0 && (
                      <p className="muted">No submissions yet for this problem.</p>
                    )}
                    {currentProblemSubmissions.length > 0 && (
                      <table>
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Runtime</th>
                            <th>Memory</th>
                            <th>When</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProblemSubmissions.map((entry) => (
                            <tr key={entry.id}>
                              <td className={getStatusClass(entry.status)}>{entry.status}</td>
                              <td>{entry.runtimeMs} ms</td>
                              <td>{entry.memoryMb} MB</td>
                              <td>{formatDateTime(entry.submittedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </article>
                </section>

                <section className="right-column">
                  <article className="card">
                    <div className="editor-header">
                      <h3>Code (JavaScript)</h3>
                      <button type="button" className="ghost-button" onClick={handleCodeReset}>
                        Reset Starter
                      </button>
                    </div>
                    <textarea
                      className="editor"
                      value={currentCode}
                      onChange={(event) =>
                        setDrafts((previous) => ({
                          ...previous,
                          [selectedProblem.id]: event.target.value
                        }))
                      }
                      spellCheck={false}
                    />
                    <div className="editor-actions">
                      <button type="button" className="secondary-button" onClick={() => runEvaluation("run")}>
                        Run Sample Tests
                      </button>
                      <button type="button" className="primary-button" onClick={() => runEvaluation("submit")}>
                        Submit
                      </button>
                    </div>
                  </article>

                  <article className="card">
                    <h3>Console</h3>
                    {!result && <p className="muted">Run code to see case-by-case output.</p>}

                    {result?.compileError && (
                      <div className="result-block">
                        <p className="status-compile">
                          <strong>Compile Error</strong>
                        </p>
                        <p>{result.compileError}</p>
                      </div>
                    )}

                    {result && !result.compileError && (
                      <div className="result-block">
                        <p className={getStatusClass(result.status)}>
                          <strong>{result.mode === "run" ? "Run" : "Submission"}: {result.status}</strong>
                        </p>
                        <p>
                          Passed {result.passedCount} / {result.total} tests
                        </p>
                        <p>
                          Runtime: {result.runtimeMs} ms | Memory: {result.memoryMb} MB
                        </p>

                        {result.mode === "submit" && result.firstFailure && (
                          <p>
                            First failed hidden test: case #{result.firstFailure.caseNumber}
                          </p>
                        )}

                        {result.mode === "run" && (
                          <div className="case-list">
                            {result.caseResults.map((caseResult) => (
                              <div
                                key={`run-case-${caseResult.caseNumber}`}
                                className={`case-item ${caseResult.passed ? "case-pass" : "case-fail"}`}
                              >
                                <p>
                                  <strong>Case {caseResult.caseNumber}</strong> -{" "}
                                  {caseResult.passed ? "Passed" : "Failed"}
                                </p>
                                <p>Input: {formatValue(caseResult.input)}</p>
                                <p>Expected: {formatValue(caseResult.expected)}</p>
                                <p>Actual: {formatValue(caseResult.actual)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </article>

                  <article className="card">
                    <h3>Recent Activity</h3>
                    {submissions.length === 0 && <p className="muted">No submissions yet.</p>}
                    {submissions.length > 0 && (
                      <ul className="activity-list">
                        {submissions.slice(0, 6).map((entry) => (
                          <li key={entry.id}>
                            <span>{entry.title}</span>
                            <span className={getStatusClass(entry.status)}>{entry.status}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
