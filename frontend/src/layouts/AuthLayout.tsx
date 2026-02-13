import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10" />

      <div className="flex min-h-screen items-center justify-center px-4 relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
