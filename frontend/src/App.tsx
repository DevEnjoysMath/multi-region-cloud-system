
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";

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
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
