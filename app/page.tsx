import { RedditDashboard } from "@/components/reddit-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:from-slate-50 light:via-white light:to-slate-100">
      <div className="relative">
        <RedditDashboard />
      </div>
    </main>
  )
}
