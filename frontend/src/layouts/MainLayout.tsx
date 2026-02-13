import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function MainLayout() {
  const location = useLocation();

  const title =
    location.pathname === "/orders" ? "Orders" : "App";

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* topbar design for the main layout pages */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/orders" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600" />
            <span className="font-semibold">Toast</span>
            <span className="text-sm text-muted-foreground">{title}</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/orders">Orders</Link>
            </Button>

            <Button asChild variant="ghost">
              <Link to="/dev">Dev</Link>
            </Button>

            <Button asChild variant="outline">
              <Link to="/login">Log out</Link>
            </Button>
          </nav>

        </div>
      </header>

      {/* generic page content we can add to later */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
