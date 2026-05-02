import { Link } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge.jsx";
import StatusPill from "./StatusPill.jsx";

export default function ProblemTable({ problems }) {
  return (
    <div className="overflow-hidden rounded border border-arena-line bg-arena-panel">
      <table className="w-full text-sm">
        <thead className="border-b border-arena-line text-left text-xs uppercase tracking-wide text-arena-muted">
          <tr>
            <th className="w-24 px-4 py-3">Status</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Difficulty</th>
            <th className="hidden px-4 py-3 md:table-cell">Tags</th>
            <th className="hidden px-4 py-3 md:table-cell">Acceptance</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id} className={index % 2 ? "bg-zinc-500/5" : ""}>
              <td className="px-4 py-3"><StatusPill status={problem.userStatus || "Unsolved"} /></td>
              <td className="px-4 py-3">
                <Link className="font-medium hover:text-arena-orange" to={`/problems/${problem.slug}`}>
                  {problem.order}. {problem.title}
                </Link>
              </td>
              <td className="px-4 py-3"><DifficultyBadge difficulty={problem.difficulty} /></td>
              <td className="hidden px-4 py-3 md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {problem.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </td>
              <td className="hidden px-4 py-3 text-arena-muted md:table-cell">{problem.acceptanceRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
