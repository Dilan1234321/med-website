import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { ToastProvider } from "./ToastProvider";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site Settings" },
  { href: "/admin/leadership", label: "Exec Board" },
  { href: "/admin/events", label: "Events" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-bg-muted md:flex-row">
        <aside className="flex shrink-0 flex-col border-b border-line bg-bg px-4 py-4 md:w-60 md:border-b-0 md:border-r md:py-6">
          <p className="mb-3 px-2 text-sm font-semibold uppercase tracking-wide text-ink-muted md:mb-6">MED Admin</p>
          <nav className="flex flex-1 gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-3 md:mt-0">
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-bg-muted">
              Sign out
            </button>
          </form>
        </aside>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
