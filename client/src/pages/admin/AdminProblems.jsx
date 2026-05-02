import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit, Plus, Trash2 } from "lucide-react";
import DifficultyBadge from "../../components/DifficultyBadge.jsx";
import { problemService } from "../../services/problemService";

export default function AdminProblems() {
  const [problems, setProblems] = useState([]);

  function load() {
    problemService.adminList().then(({ problems: data }) => setProblems(data)).catch(() => toast.error("Could not load admin problems"));
  }

  useEffect(load, []);

  async function remove(id) {
    if (!confirm("Delete this problem?")) return;
    await problemService.remove(id);
    toast.success("Problem deleted");
    load();
  }

  return (
    <section className="rounded border border-arena-line bg-arena-panel">
      <div className="flex items-center justify-between border-b border-arena-line p-4">
        <div>
          <h1 className="text-2xl font-semibold">Problems</h1>
          <p className="mt-1 text-sm text-arena-muted">Add, edit, delete, and manage test cases.</p>
        </div>
        <Link className="primary-button" to="/admin/problems/new"><Plus size={16} /> Add problem</Link>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-arena-line text-left text-xs uppercase text-arena-muted">
          <tr><th className="px-4 py-3">Title</th><th>Difficulty</th><th>Tests</th><th className="text-right pr-4">Actions</th></tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr className="border-b border-arena-line/60" key={problem._id}>
              <td className="px-4 py-3 font-medium">{problem.order}. {problem.title}</td>
              <td><DifficultyBadge difficulty={problem.difficulty} /></td>
              <td className="text-arena-muted">{problem.publicTestCases?.length || 0} public · {problem.hiddenTestCount || 0} hidden</td>
              <td className="pr-4">
                <div className="flex justify-end gap-2">
                  <Link className="icon-button" to={`/admin/problems/${problem._id}/edit`}><Edit size={16} /></Link>
                  <button className="icon-button text-red-500" onClick={() => remove(problem._id)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
