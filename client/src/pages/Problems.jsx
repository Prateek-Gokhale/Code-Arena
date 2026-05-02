import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import toast from "react-hot-toast";
import ProblemTable from "../components/ProblemTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { problemService } from "../services/problemService";

const difficulties = ["All", "Easy", "Medium", "Hard"];

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", difficulty: "All", tag: "All" });

  useEffect(() => {
    setLoading(true);
    problemService
      .list({
        search: filters.search || undefined,
        difficulty: filters.difficulty === "All" ? undefined : filters.difficulty,
        tag: filters.tag === "All" ? undefined : filters.tag
      })
      .then(({ problems: data }) => setProblems(data))
      .catch(() => toast.error("Could not load problems"))
      .finally(() => setLoading(false));
  }, [filters]);

  const tags = useMemo(() => Array.from(new Set(problems.flatMap((problem) => problem.tags))).sort(), [problems]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Problemset</h1>
          <p className="mt-2 text-sm text-arena-muted">Choose a problem, open the workspace, run samples, and submit against hidden tests.</p>
        </div>
        <div className="grid gap-2 md:grid-cols-[260px_150px_170px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-muted" size={16} />
            <input className="input pl-9" placeholder="Search problems" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </label>
          <label className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-muted" size={16} />
            <select className="input pl-9" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
              {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
            </select>
          </label>
          <select className="input" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })}>
            <option>All</option>
            {tags.map((tag) => <option key={tag}>{tag}</option>)}
          </select>
        </div>
      </div>
      {loading && <div className="screen-loader rounded border border-arena-line">Loading problems...</div>}
      {!loading && problems.length > 0 && <ProblemTable problems={problems} />}
      {!loading && problems.length === 0 && <EmptyState title="No matching problems" body="Try clearing your filters or seed the database." />}
    </main>
  );
}
