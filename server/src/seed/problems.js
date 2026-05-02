export const seedProblems = [
  {
    order: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] equals 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] equals 6." }
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Exactly one valid answer exists."],
    solutionFunction: "twoSum",
    starterCode: {
      javascript: "function twoSum(nums, target) {\n  // return the two indices\n}",
      python: "def twoSum(nums, target):\n    # return the two indices\n    pass",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}",
      cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"
    },
    publicTestCases: [
      { input: "[[2,7,11,15],9]", expectedOutput: "[0,1]" },
      { input: "[[3,2,4],6]", expectedOutput: "[1,2]" }
    ],
    hiddenTestCases: [
      { input: "[[3,3],6]", expectedOutput: "[0,1]" },
      { input: "[[-1,-2,-3,-4,-5],-8]", expectedOutput: "[2,4]" }
    ]
  },
  {
    order: 2,
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["Two Pointers", "String"],
    description:
      "Write a function that reverses a string. The input string is given as an array of characters s. Return the reversed array.",
    examples: [
      { input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]", explanation: "The array is reversed in-place conceptually." }
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is a printable ASCII character."],
    solutionFunction: "reverseString",
    starterCode: {
      javascript: "function reverseString(s) {\n  // return the reversed character array\n}",
      python: "def reverseString(s):\n    pass",
      java: "class Solution {\n    public char[] reverseString(char[] s) {\n        return s;\n    }\n}",
      cpp: "class Solution {\npublic:\n    vector<char> reverseString(vector<char>& s) {\n        return s;\n    }\n};"
    },
    publicTestCases: [
      { input: "[[\"h\",\"e\",\"l\",\"l\",\"o\"]]", expectedOutput: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
      { input: "[[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]]", expectedOutput: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
    ],
    hiddenTestCases: [
      { input: "[[\"a\"]]", expectedOutput: "[\"a\"]" },
      { input: "[[\"c\",\"o\",\"d\",\"e\"]]", expectedOutput: "[\"e\",\"d\",\"o\",\"c\"]" }
    ]
  },
  {
    order: 3,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.",
    examples: [
      { input: "s = \"()[]{}\"", output: "true", explanation: "Each bracket pair closes correctly." },
      { input: "s = \"(]\"", output: "false", explanation: "The bracket types do not match." }
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only: ()[]{}."],
    solutionFunction: "isValid",
    starterCode: {
      javascript: "function isValid(s) {\n  // return true when s is valid\n}",
      python: "def isValid(s):\n    pass",
      java: "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};"
    },
    publicTestCases: [
      { input: "[\"()[]{}\"]", expectedOutput: "true" },
      { input: "[\"(]\"]", expectedOutput: "false" }
    ],
    hiddenTestCases: [
      { input: "[\"{[]}\"]", expectedOutput: "true" },
      { input: "[\"([)]\"]", expectedOutput: "false" }
    ]
  },
  {
    order: 4,
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    description:
      "You are given an array prices where prices[i] is the price of a stock on day i. Choose one day to buy and one later day to sell. Return the maximum profit, or 0 if no profit is possible.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 and sell on day 5." }
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    solutionFunction: "maxProfit",
    starterCode: {
      javascript: "function maxProfit(prices) {\n  \n}",
      python: "def maxProfit(prices):\n    pass",
      java: "class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};"
    },
    publicTestCases: [
      { input: "[[7,1,5,3,6,4]]", expectedOutput: "5" },
      { input: "[[7,6,4,3,1]]", expectedOutput: "0" }
    ],
    hiddenTestCases: [
      { input: "[[2,4,1]]", expectedOutput: "2" },
      { input: "[[1,2]]", expectedOutput: "1" }
    ]
  }
];
