const cloneValue = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  if (typeof value === "undefined") {
    return undefined;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return value;
  }
};

export const deepEqual = (left, right) => {
  if (Object.is(left, right)) {
    return true;
  }

  if (typeof left !== typeof right) {
    return false;
  }

  if (left === null || right === null) {
    return left === right;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i++) {
      if (!deepEqual(left[i], right[i])) {
        return false;
      }
    }
    return true;
  }

  if (typeof left === "object" && typeof right === "object") {
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    if (!deepEqual(leftKeys, rightKeys)) {
      return false;
    }

    for (const key of leftKeys) {
      if (!deepEqual(left[key], right[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
};

export const formatValue = (value) => {
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "undefined") {
    return "undefined";
  }
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const compileFunction = (code, functionName) => {
  const wrapped = `
"use strict";
${code}
if (typeof ${functionName} !== "function") {
  throw new Error("Expected a function named ${functionName}");
}
return ${functionName};
`;
  return new Function(wrapped)();
};

export const evaluateSolution = (problem, code, testCases) => {
  let candidateFn;
  try {
    candidateFn = compileFunction(code, problem.functionName);
  } catch (error) {
    return {
      compileError: error?.message || "Compilation error."
    };
  }

  const startedAt = performance.now();
  const caseResults = [];

  for (let index = 0; index < testCases.length; index++) {
    const testCase = testCases[index];
    try {
      const args = cloneValue(testCase.input);
      const result = candidateFn(...args);
      const actual = cloneValue(result);
      const passed = typeof problem.judge === "function"
        ? problem.judge(actual, testCase, deepEqual)
        : deepEqual(actual, testCase.expected);

      caseResults.push({
        caseNumber: index + 1,
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual
      });
    } catch (error) {
      caseResults.push({
        caseNumber: index + 1,
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: `Runtime Error: ${error?.message || "Unknown error"}`
      });
    }
  }

  const elapsedMs = Math.max(1, Math.round((performance.now() - startedAt) * 100) / 100);
  const passedCount = caseResults.filter((entry) => entry.passed).length;

  return {
    caseResults,
    elapsedMs,
    total: caseResults.length,
    passedCount
  };
};
