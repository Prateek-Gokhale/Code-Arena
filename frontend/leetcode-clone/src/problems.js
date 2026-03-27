const normalizeAnagramGroups = (groups) => {
  if (!Array.isArray(groups)) {
    return null;
  }

  const normalized = groups.map((group) => {
    if (!Array.isArray(group)) {
      return null;
    }
    return [...group].sort();
  });

  if (normalized.some((entry) => entry === null)) {
    return null;
  }

  return normalized.sort((a, b) => a.join("|").localeCompare(b.join("|")));
};

const twoSumJudge = (actual, testCase) => {
  if (!Array.isArray(actual) || actual.length !== 2) {
    return false;
  }

  const [i, j] = actual;
  if (!Number.isInteger(i) || !Number.isInteger(j) || i === j) {
    return false;
  }

  const [nums, target] = testCase.input;
  if (i < 0 || i >= nums.length || j < 0 || j >= nums.length) {
    return false;
  }

  return nums[i] + nums[j] === target;
};

const groupAnagramJudge = (actual, testCase, deepEqual) => {
  const normalizedActual = normalizeAnagramGroups(actual);
  const normalizedExpected = normalizeAnagramGroups(testCase.expected);
  if (!normalizedActual || !normalizedExpected) {
    return false;
  }
  return deepEqual(normalizedActual, normalizedExpected);
};

export const PROBLEMS = [
  {
    id: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    acceptance: "49.7%",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid answer exists."
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] == 9"
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 6"
      }
    ],
    functionName: "twoSum",
    starterCode: `function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }

  return [];
}`,
    sampleTests: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ],
    hiddenTests: [
      { input: [[5, 4, 8, 1], 9], expected: [0, 1] },
      { input: [[-3, 4, 3, 90], 0], expected: [0, 2] },
      { input: [[10, 15, 2, 7, 11], 9], expected: [2, 3] }
    ],
    judge: twoSumJudge
  },
  {
    id: 2,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    acceptance: "42.1%",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only."
    ],
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets close in the correct order."
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Opening bracket type does not match."
      }
    ],
    functionName: "isValid",
    starterCode: `function isValid(s) {
  const pairs = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"]
  ]);

  const stack = [];
  for (const ch of s) {
    if (pairs.has(ch)) {
      if (stack.pop() !== pairs.get(ch)) {
        return false;
      }
    } else {
      stack.push(ch);
    }
  }

  return stack.length === 0;
}`,
    sampleTests: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false }
    ],
    hiddenTests: [
      { input: ["([{}])"], expected: true },
      { input: ["((((("], expected: false },
      { input: ["{[()]}[]"], expected: true }
    ]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["String", "Sliding Window", "Hash Table"],
    acceptance: "35.4%",
    description:
      "Given a string s, find the length of the longest substring without duplicate characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols, and spaces."
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b".'
      }
    ],
    functionName: "lengthOfLongestSubstring",
    starterCode: `function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLength = 0;
  const seen = new Map();

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1;
    }
    seen.set(ch, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}`,
    sampleTests: [
      { input: ["abcabcbb"], expected: 3 },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3 }
    ],
    hiddenTests: [
      { input: [""], expected: 0 },
      { input: ["dvdf"], expected: 3 },
      { input: ["anviaj"], expected: 5 }
    ]
  },
  {
    id: 4,
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    tags: ["Array", "Sorting"],
    acceptance: "47.3%",
    description:
      "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "[1,3] and [2,6] overlap."
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Touching intervals are merged."
      }
    ],
    functionName: "merge",
    starterCode: `function merge(intervals) {
  if (intervals.length <= 1) {
    return intervals;
  }

  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0].slice()];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const current = merged[merged.length - 1];
    if (start <= current[1]) {
      current[1] = Math.max(current[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}`,
    sampleTests: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
    ],
    hiddenTests: [
      { input: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
      { input: [[[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]]], expected: [[1, 10]] },
      { input: [[[1, 2], [3, 5], [4, 6], [7, 8]]], expected: [[1, 2], [3, 6], [7, 8]] }
    ]
  },
  {
    id: 5,
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    tags: ["Array", "Hash Table", "String", "Sorting"],
    acceptance: "69.0%",
    description:
      "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Words with the same character counts belong together."
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: "Single empty string group."
      }
    ],
    functionName: "groupAnagrams",
    starterCode: `function groupAnagrams(strs) {
  const map = new Map();

  for (const word of strs) {
    const key = word.split("").sort().join("");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(word);
  }

  return Array.from(map.values());
}`,
    sampleTests: [
      {
        input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
      },
      { input: [[""]], expected: [[""]] },
      { input: [["a"]], expected: [["a"]] }
    ],
    hiddenTests: [
      { input: [["ab", "ba", "abc", "cab", "foo"]], expected: [["ab", "ba"], ["abc", "cab"], ["foo"]] },
      { input: [["listen", "silent", "enlist", "rat", "tar", "art"]], expected: [["listen", "silent", "enlist"], ["rat", "tar", "art"]] }
    ],
    judge: groupAnagramJudge
  },
  {
    id: 6,
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    acceptance: "62.2%",
    description:
      "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "Six units of water are trapped."
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        explanation: "Nine units of water are trapped."
      }
    ],
    functionName: "trap",
    starterCode: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let trapped = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      trapped += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      trapped += rightMax - height[right];
      right--;
    }
  }

  return trapped;
}`,
    sampleTests: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 }
    ],
    hiddenTests: [
      { input: [[2, 0, 2]], expected: 2 },
      { input: [[5, 4, 1, 2]], expected: 1 },
      { input: [[3, 0, 0, 2, 0, 4]], expected: 10 }
    ]
  }
];

export const ALL_TAGS = Array.from(
  new Set(PROBLEMS.flatMap((problem) => problem.tags))
).sort((a, b) => a.localeCompare(b));
