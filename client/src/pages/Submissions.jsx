import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { submissionService } from "../services/submissionService";
import { statusClass, timeAgo } from "../utils/formatters";
import EmptyState from "../components/EmptyState.jsx";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    submissionService
      .list()
      .then(({ submissions: data }) => setSubmissions(data))
      .catch(() => toast.error("Could not load submissions"));
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[1fr_520px]">
      <section className="rounded border border-arena-line bg-arena-panel">
        <div className="border-b border-arena-line p-4">
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <p className="mt-1 text-sm text-arena-muted">Every run submitted against hidden test cases is stored here.</p>
        </div>
        {submissions.length === 0 ? (
          <div className="p-4"><EmptyState title="No submissions" body="Solve a problem to build your history." /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-arena-line text-left text-xs uppercase text-arena-muted">
              <tr>
                <th className="px-4 py-3">Problem</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Language</th>
                <th className="hidden px-4 py-3 md:table-cell">Runtime</th>
                <th className="hidden px-4 py-3 md:table-cell">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr className="cursor-pointer border-b border-arena-line/60 hover:bg-zinc-500/10" key={submission._id} onClick={() => setSelected(submission)}>
                  <td className="px-4 py-3 font-medium">{submission.problem?.title || "Problem"}</td>
                  <td className={`px-4 py-3 font-medium ${statusClass[submission.status] || ""}`}>{submission.status}</td>
                  <td className="px-4 py-3">{submission.language}</td>
                  <td className="hidden px-4 py-3 text-arena-muted md:table-cell">{submission.runtimeMs || "-"} ms</td>
                  <td className="hidden px-4 py-3 text-arena-muted md:table-cell">{timeAgo(submission.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <aside className="rounded border border-arena-line bg-arena-panel">
        <div className="border-b border-arena-line p-4">
          <h2 className="font-semibold">Submitted code</h2>
          <p className="mt-1 text-sm text-arena-muted">Select a row to inspect the exact code.</p>
        </div>
        <pre className="h-[620px] overflow-auto p-4 text-sm text-arena-muted">{selected?.code || "No submission selected."}</pre>
      </aside>
    </main>
  );
}
