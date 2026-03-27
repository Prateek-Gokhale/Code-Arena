import { useEffect, useMemo, useState } from "react";
import { ALL_TAGS, PROBLEMS } from "./problems";
import { evaluateSolution, formatValue } from "./evaluator";

const STORAGE_KEY = "algo_arena_state_v1";
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const NAV_ITEMS = ["Explore", "Problems", "Contest", "Discuss"];

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
  const [questionTab, setQuestionTab] = useState("description");
  const [consoleTab, setConsoleTab] = useState("result");

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
      .slice(0, 12);
  }, [submissions, selectedProblem]);

  const solvedCount = solvedProblemIds.length;

  const runEvaluation = (mode) => {
    if (!selectedProblem) {
      return;
    }

    setConsoleTab("result");
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
    setQuestionTab("description");
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
    <div className="lc-app">
      <header className="lc-topbar">
        <div className="lc-brand">
          <div className="lc-brand-mark">{"</>"}</div>
          <div className="lc-brand-copy">
            <strong>Code Arena</strong>
            <span>Practice Workspace</span>
          </div>
        </div>

        <nav className="lc-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item} type="button" className={`lc-nav-item ${item === "Problems" ? "active" : ""}`}>
              {item}
            </button>
          ))}
        </nav>

        <div className="lc-top-stats">
          <div>
            <span>Solved</span>
            <strong>
              {solvedCount}/{PROBLEMS.length}
            </strong>
          </div>
          <div>
            <span>Submissions</span>
            <strong>{submissions.length}</strong>
          </div>
        </div>
      </header>

      <div className="lc-shell">
        <aside className="lc-problem-rail">
          <div className="lc-rail-head">
            <h2>Problemset</h2>
            <span>{filteredProblems.length}</span>
          </div>

          <div className="lc-rail-filters">
            <input
              type="text"
              placeholder="Search by title or #"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <div className="lc-filter-row">
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

          <div className="lc-problem-list">
            {filteredProblems.length === 0 && (
              <div className="lc-empty">No matching problems.</div>
            )}

            {filteredProblems.map((problem) => {
              const solved = solvedProblemIds.includes(problem.id);
              const active = selectedProblem?.id === problem.id;
              return (
                <button
                  key={problem.id}
                  type="button"
                  className={`lc-problem-row ${active ? "active" : ""}`}
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  <div className="lc-row-top">
                    <span className={`lc-status-dot ${solved ? "solved" : "pending"}`} />
                    <strong>
                      {problem.id}. {problem.title}
                    </strong>
                  </div>
                  <div className="lc-row-bottom">
                    <span className={`lc-badge ${DIFFICULTY_CLASS[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    <span>{problem.acceptance}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="lc-main">
          {!selectedProblem && (
            <section className="lc-panel">
              <h2>No problem selected</h2>
            </section>
          )}

          {selectedProblem && (
            <div className="lc-main-split">
              <section className="lc-panel lc-question-pane">
                <div className="lc-question-head">
                  <h1>
                    {selectedProblem.id}. {selectedProblem.title}
                  </h1>
                  <div className="lc-question-meta">
                    <span className={`lc-badge ${DIFFICULTY_CLASS[selectedProblem.difficulty]}`}>
                      {selectedProblem.difficulty}
                    </span>
                    <span>{selectedProblem.acceptance} acceptance</span>
                    <span>
                      Solved by you: {solvedProblemIds.includes(selectedProblem.id) ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="lc-tag-row">
                    {selectedProblem.tags.map((tag) => (
                      <span className="lc-tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lc-tabs">
                  <button
                    type="button"
                    className={questionTab === "description" ? "active" : ""}
                    onClick={() => setQuestionTab("description")}
                  >
                    Description
                  </button>
                  <button
                    type="button"
                    className={questionTab === "submissions" ? "active" : ""}
                    onClick={() => setQuestionTab("submissions")}
                  >
                    Submissions
                  </button>
                </div>

                <div className="lc-tab-content">
                  {questionTab === "description" && (
                    <div className="lc-description">
                      <p>{selectedProblem.description}</p>

                      <h3>Examples</h3>
                      {selectedProblem.examples.map((example, index) => (
                        <div className="lc-example" key={`${selectedProblem.id}-example-${index}`}>
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

                      <h3>Constraints</h3>
                      <ul>
                        {selectedProblem.constraints.map((constraint) => (
                          <li key={constraint}>{constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {questionTab === "submissions" && (
                    <div>
                      {currentProblemSubmissions.length === 0 && (
                        <p className="lc-muted">No submissions yet for this problem.</p>
                      )}
                      {currentProblemSubmissions.length > 0 && (
                        <table className="lc-table">
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Runtime</th>
                              <th>Memory</th>
                              <th>Submitted</th>
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
                    </div>
                  )}
                </div>
              </section>

              <section className="lc-panel lc-editor-pane">
                <div className="lc-editor-toolbar">
                  <div className="lc-editor-meta">
                    <span>JavaScript</span>
                    <code>{selectedProblem.functionName}(...args)</code>
                  </div>
                  <button type="button" className="lc-ghost-button" onClick={handleCodeReset}>
                    Reset
                  </button>
                </div>

                <textarea
                  className="lc-editor"
                  value={currentCode}
                  onChange={(event) =>
                    setDrafts((previous) => ({
                      ...previous,
                      [selectedProblem.id]: event.target.value
                    }))
                  }
                  spellCheck={false}
                />

                <div className="lc-editor-actions">
                  <button
                    type="button"
                    className="lc-secondary-button"
                    onClick={() => runEvaluation("run")}
                  >
                    Run
                  </button>
                  <button
                    type="button"
                    className="lc-primary-button"
                    onClick={() => runEvaluation("submit")}
                  >
                    Submit
                  </button>
                </div>

                <div className="lc-console">
                  <div className="lc-tabs lc-tabs-compact">
                    <button
                      type="button"
                      className={consoleTab === "result" ? "active" : ""}
                      onClick={() => setConsoleTab("result")}
                    >
                      Test Result
                    </button>
                    <button
                      type="button"
                      className={consoleTab === "activity" ? "active" : ""}
                      onClick={() => setConsoleTab("activity")}
                    >
                      Activity
                    </button>
                  </div>

                  {consoleTab === "result" && (
                    <div className="lc-console-body">
                      {!result && <p className="lc-muted">Run code to see output and verdict details.</p>}

                      {result?.compileError && (
                        <div className="lc-result-block">
                          <p className="status-compile">
                            <strong>Compile Error</strong>
                          </p>
                          <p>{result.compileError}</p>
                        </div>
                      )}

                      {result && !result.compileError && (
                        <div className="lc-result-block">
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
                            <p>First failed hidden test: case #{result.firstFailure.caseNumber}</p>
                          )}

                          {result.mode === "run" && (
                            <div className="lc-case-list">
                              {result.caseResults.map((caseResult) => (
                                <div
                                  key={`run-case-${caseResult.caseNumber}`}
                                  className={`lc-case-item ${caseResult.passed ? "pass" : "fail"}`}
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
                    </div>
                  )}

                  {consoleTab === "activity" && (
                    <div className="lc-console-body">
                      {submissions.length === 0 && <p className="lc-muted">No submissions yet.</p>}
                      {submissions.length > 0 && (
                        <ul className="lc-activity-list">
                          {submissions.slice(0, 10).map((entry) => (
                            <li key={entry.id}>
                              <span>
                                {entry.title} - {formatDateTime(entry.submittedAt)}
                              </span>
                              <span className={getStatusClass(entry.status)}>{entry.status}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
