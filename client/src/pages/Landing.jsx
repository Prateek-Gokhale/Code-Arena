import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Code2, ShieldCheck, TerminalSquare } from "lucide-react";

const features = [
  ["LeetCode-style workspace", "Split problem reading, Monaco editing, test panels, verdicts, and submission history."],
  ["Real accounts", "JWT auth, protected routes, bcrypt password storage, and progress tied to each user."],
  ["Admin problem bank", "Create problems with starter code, examples, constraints, public tests, and hidden tests."],
  ["Judge-ready backend", "Judge0 integration is wired, with a local JavaScript runner fallback for seeded problems."]
];

export default function Landing() {
  return (
    <main>
      <section className="border-b border-arena-line bg-arena-panel">
        <div className="mx-auto grid min-h-[calc(100vh-56px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-arena-line px-3 py-1 text-sm text-arena-muted">
              <TerminalSquare size={16} className="text-arena-orange" /> Practice, run, submit, improve
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">CodeArena</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-arena-muted">
              A complete coding practice platform with a polished LeetCode-inspired interface, multi-language editor, submissions, progress analytics, and admin tooling.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-button h-11 px-5" to="/problems">
                Browse problems <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button h-11 px-5" to="/register">Create account</Link>
            </div>
          </div>
          <div className="rounded border border-arena-line bg-arena-page shadow-soft">
            <div className="flex items-center gap-2 border-b border-arena-line px-4 py-3 text-sm text-arena-muted">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3">two-sum.js</span>
            </div>
            <div className="grid min-h-[430px] md:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-arena-line p-5 md:border-b-0 md:border-r">
                <span className="difficulty-badge badge-easy">Easy</span>
                <h2 className="mt-4 text-2xl font-semibold">1. Two Sum</h2>
                <p className="mt-4 text-sm leading-7 text-arena-muted">Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
                <div className="mt-5 rounded bg-zinc-500/10 p-3 text-sm">
                  <p><b>Input:</b> nums = [2,7,11,15], target = 9</p>
                  <p><b>Output:</b> [0,1]</p>
                </div>
              </div>
              <div className="p-5 font-mono text-sm leading-7">
                <p className="text-purple-400">function <span className="text-blue-400">twoSum</span>(nums, target) {"{"}</p>
                <p className="pl-5 text-arena-muted">const seen = new Map();</p>
                <p className="pl-5 text-arena-muted">for (let i = 0; i &lt; nums.length; i++) {"{"}</p>
                <p className="pl-10 text-arena-muted">const need = target - nums[i];</p>
                <p className="pl-10 text-emerald-400">if (seen.has(need)) return [seen.get(need), i];</p>
                <p className="pl-10 text-arena-muted">seen.set(nums[i], i);</p>
                <p className="pl-5 text-arena-muted">{"}"}</p>
                <p className="text-purple-400">{"}"}</p>
                <div className="mt-8 rounded border border-emerald-500/30 bg-emerald-500/10 p-4 font-sans text-sm text-emerald-500">
                  Accepted · 3 / 3 tests · 42 ms · 38.4 MB
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-4">
        {features.map(([title, body]) => (
          <div className="rounded border border-arena-line bg-arena-panel p-5" key={title}>
            <Code2 className="mb-4 text-arena-orange" size={22} />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-arena-muted">{body}</p>
          </div>
        ))}
        <div className="rounded border border-arena-line bg-arena-panel p-5 md:col-span-2">
          <BarChart3 className="mb-4 text-arena-orange" size={22} />
          <h3 className="font-semibold">Progress dashboard</h3>
          <p className="mt-2 text-sm leading-6 text-arena-muted">Track solved totals, difficulty breakdowns, recent activity, and daily submission momentum.</p>
        </div>
        <div className="rounded border border-arena-line bg-arena-panel p-5 md:col-span-2">
          <ShieldCheck className="mb-4 text-arena-orange" size={22} />
          <h3 className="font-semibold">Production-shaped API</h3>
          <p className="mt-2 text-sm leading-6 text-arena-muted">Express MVC routes, validation, error middleware, environment config, and admin-only problem management.</p>
        </div>
      </section>
    </main>
  );
}
