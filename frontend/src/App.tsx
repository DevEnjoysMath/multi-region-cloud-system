import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { LandingPage } from "./pages/LandingPage";
import OrdersPage from "./pages/OrdersPage";
import DatabaseHealth from "./pages/DatabaseHealth";

import logoUrl from "./assets/logo.svg";
import "./index.css";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* routing */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <LandingPage />
            </Page>
          }
        />
        <Route
          path="/login"
          element={
            <Page>
              <LoginPage />
            </Page>
          }
        />
        <Route
          path="/signup"
          element={
            <Page>
              <SignupPage />
            </Page>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Page>
              <ForgotPasswordPage />
            </Page>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Page>
              <OrdersPage />
            </Page>
          }
        />
        <Route
          path="/health"
          element={
            <Page>
              <DatabaseHealth />
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AppShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen bg-white relative">
      {/* logo that brings back to get started page */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 rounded-xl p-2
                   bg-white/80 backdrop-blur
                   shadow-md hover:shadow-lg
                   transition-all duration-200
                   hover:scale-[1.03] active:scale-[0.98]"
        aria-label="Go to Get Started"
      >
        <img
          src={logoUrl}
          alt="Toast Logo"
          className="h-10 w-auto select-none"
          draggable={false}
        />
      </button>

      {/* Pages */}
      <AnimatedRoutes />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
