import axios from "axios";
import vm from "node:vm";

const judgeLanguageIds = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54
};

function normalize(value) {
  try {
    return JSON.stringify(JSON.parse(value));
  } catch {
    return String(value).trim();
  }
}

function runJavaScript(problem, code, tests) {
  const started = performance.now();
  const testResults = [];
  let stdout = "";

  try {
    const sandbox = {
      console: {
        log: (...args) => {
          stdout += `${args.map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg))).join(" ")}\n`;
        }
      },
      setTimeout: undefined,
      setInterval: undefined
    };
    vm.createContext(sandbox);
    vm.runInContext(`${code}\n;globalThis.__candidate = ${problem.solutionFunction};`, sandbox, { timeout: 1500 });

    if (typeof sandbox.__candidate !== "function") {
      throw new Error(`Function ${problem.solutionFunction} was not found`);
    }

    for (const [index, test] of tests.entries()) {
      const args = JSON.parse(test.input);
      const actual = sandbox.__candidate(...args);
      const actualOutput = JSON.stringify(actual);
      const passed = normalize(actualOutput) === normalize(test.expectedOutput);
      testResults.push({
        caseNumber: index + 1,
        passed,
        input: test.input,
        expectedOutput: test.expectedOutput,
        actualOutput
      });
    }

    const passedTests = testResults.filter((test) => test.passed).length;
    return {
      status: passedTests === tests.length ? "Accepted" : "Wrong Answer",
      runtimeMs: Math.max(1, Math.round(performance.now() - started)),
      memoryKb: Math.round(process.memoryUsage().heapUsed / 1024),
      passedTests,
      totalTests: tests.length,
      stdout,
      testResults
    };
  } catch (error) {
    return {
      status: "Runtime Error",
      runtimeMs: Math.max(1, Math.round(performance.now() - started)),
      memoryKb: Math.round(process.memoryUsage().heapUsed / 1024),
      passedTests: testResults.filter((test) => test.passed).length,
      totalTests: tests.length,
      stdout,
      error: error.message,
      testResults
    };
  }
}

async function runJudge0(problem, language, code, tests) {
  const baseUrl = process.env.JUDGE0_URL;
  const apiKey = process.env.JUDGE0_KEY;
  if (!baseUrl || !apiKey) return null;

  const source = `${code}\n\n// CodeArena runner expects your program to read stdin and print output.`;
  const testResults = [];
  let maxRuntime = 0;
  let maxMemory = 0;
  let combinedStdout = "";
  let finalStatus = "Accepted";

  for (const [index, test] of tests.entries()) {
    const { data: created } = await axios.post(
      `${baseUrl}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: source,
        language_id: judgeLanguageIds[language],
        stdin: test.input,
        expected_output: test.expectedOutput
      },
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com"
        },
        timeout: 15000
      }
    );
    const passed = created.status?.id === 3;
    if (!passed) finalStatus = created.status?.description || "Wrong Answer";
    maxRuntime = Math.max(maxRuntime, Math.round(Number(created.time || 0) * 1000));
    maxMemory = Math.max(maxMemory, Number(created.memory || 0));
    combinedStdout += created.stdout || "";
    testResults.push({
      caseNumber: index + 1,
      passed,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput: created.stdout?.trim() || created.stderr || created.compile_output || ""
    });
  }

  const passedTests = testResults.filter((test) => test.passed).length;
  return {
    status: passedTests === tests.length ? "Accepted" : finalStatus,
    runtimeMs: maxRuntime,
    memoryKb: maxMemory,
    passedTests,
    totalTests: tests.length,
    stdout: combinedStdout,
    testResults
  };
}

export async function executeCode({ problem, language, code, tests }) {
  const judgeResult = await runJudge0(problem, language, code, tests);
  if (judgeResult) return judgeResult;
  if (language === "javascript") return runJavaScript(problem, code, tests);
  return {
    status: "Compilation Error",
    runtimeMs: 0,
    memoryKb: 0,
    passedTests: 0,
    totalTests: tests.length,
    error: "Set JUDGE0_KEY to execute Python, Java, and C++ submissions. JavaScript runs locally for seeded problems.",
    testResults: []
  };
}
