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
// import logoUrl from "./assets/logo.svg";
import "./index.css";

/**
 * Renders all application routes wrapped in a Framer Motion `AnimatePresence`
 * so that pages animate in and out on navigation.
 *
 * Route map:
 * - `/`                → {@link LandingPage}
 * - `/login`           → {@link LoginPage}
 * - `/signup`          → {@link SignupPage}
 * - `/forgot-password` → {@link ForgotPasswordPage}
 * - `/dashboard`       → {@link OrdersPage}
 * - `/health`          → {@link DatabaseHealth}
 *
 * `location` is read from `useLocation` and passed explicitly to `<Routes>`
 * so that `AnimatePresence` can detect the route change and trigger the exit
 * animation before mounting the next page.
 *
 * @returns The animated route tree JSX element.
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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

/**
 * Wraps a page component in a Framer Motion `div` that fades and slides
 * in on mount and out on unmount.
 *
 * Animation spec:
 * - **Enter** — fades from `opacity: 0, y: 8` to `opacity: 1, y: 0`
 * - **Exit**  — fades from `opacity: 1, y: 0` to `opacity: 0, y: -8`
 * - Duration: `180 ms`, easing: `easeOut`
 *
 * @param props - Component props.
 * @param props.children - The page content to animate.
 * @returns A motion-wrapped full-height container holding `children`.
 */
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

/**
 * Top-level layout shell rendered inside the router context.
 *
 * Provides a fixed logo button in the top-left corner that navigates back
 * to the landing page (`/`), then renders `AnimatedRoutes` below it.
 *
 * @remarks
 * The logo `src` is currently commented out pending asset pipeline setup.
 * Uncomment the `logoUrl` import and the `src` prop once the SVG is available.
 *
 * @returns The application shell JSX element.
 */
function AppShell() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-screen bg-white relative">
      {/* Logo — navigates back to the landing page */}
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
          // src={logoUrl}
          alt="Toast Logo"
          className="h-10 w-auto select-none"
          draggable={false}
        />
      </button>
      <AnimatedRoutes />
    </div>
  );
}

/**
 * Root application component.
 *
 * Mounts a `BrowserRouter` and renders `AppShell` inside it,
 * making the router context available to all descendant components.
 *
 * @returns The fully bootstrapped application JSX element.
 *
 * @example
 * // Entry point — rendered by main.tsx
 * createRoot(document.getElementById("root")!).render(<App />);
 */
export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
