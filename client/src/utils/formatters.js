export const difficultyClass = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard"
};

export const statusClass = {
  Solved: "text-emerald-500",
  Attempted: "text-amber-500",
  Unsolved: "text-arena-muted",
  Accepted: "text-emerald-500",
  "Wrong Answer": "text-red-500",
  "Runtime Error": "text-red-500",
  "Time Limit Exceeded": "text-amber-500",
  "Compilation Error": "text-amber-500"
};

export function timeAgo(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function languageToMonaco(language) {
  return {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp"
  }[language] || "javascript";
}
