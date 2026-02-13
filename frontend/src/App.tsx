import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import OrdersPage from "./pages/OrdersPage";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APITester } from "./pages/APITester";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* authentication stuff*/}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<GetStartedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* topbar is for main pages */}
        <Route element={<MainLayout />}>
          <Route path="/orders" element={<OrdersPage />} />

          {/* dev page for now until we get it better */}
          <Route
            path="/dev"
            element={
              <Card>
                <CardHeader className="gap-4">
                  <CardTitle className="text-3xl font-bold">
                    Bun + React
                  </CardTitle>
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
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
