import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { submissionService } from "../services/submissionService";
import { statusClass, timeAgo } from "../utils/formatters";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    submissionService
      .stats()
      .then((data) => setStats(data))
      .catch(() => toast.error("Could not load dashboard"));
  }, []);

  if (!stats) return <div className="screen-loader">Loading dashboard...</div>;

  const cards = [
    ["Total solved", stats.totalSolved],
    ["Easy solved", stats.byDifficulty.Easy],
    ["Medium solved", stats.byDifficulty.Medium],
    ["Hard solved", stats.byDifficulty.Hard]
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-arena-muted">Progress, recent submissions, and difficulty coverage.</p>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div className="rounded border border-arena-line bg-arena-panel p-5" key={label}>
            <p className="text-sm text-arena-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="rounded border border-arena-line bg-arena-panel p-5">
          <h2 className="font-semibold">Submission activity</h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activity}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ffa116" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded border border-arena-line bg-arena-panel p-5">
          <h2 className="font-semibold">Recent submissions</h2>
          <div className="mt-4 grid gap-3">
            {stats.recentSubmissions.map((entry) => (
              <div className="rounded border border-arena-line p-3" key={entry._id}>
                <div className="flex justify-between gap-2">
                  <span className="font-medium">{entry.problem?.title}</span>
                  <span className={statusClass[entry.status] || ""}>{entry.status}</span>
                </div>
                <p className="mt-1 text-xs text-arena-muted">{entry.language} · {timeAgo(entry.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
