import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APITester } from "./pages/APITester";
import OrdersPage from "./pages/OrdersPage";
import "./index.css";

/**
 * Root application component.
 *
 * Sets up application routing and page layout.
 */
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl bottom-10 right-10"></div>

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 gap-8">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
          <Card>
            <CardHeader className="gap-4">
              <CardTitle className="text-3xl font-bold">Bun + React</CardTitle>
              <CardDescription>
                Edit{" "}
                <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono">
                  src/App.tsx
                </code>{" "}
                and save to test HMR
              </CardDescription>
            </CardHeader>
            <CardContent>
              <APITester />

              <div className="mt-12">
                <OrdersPage />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
