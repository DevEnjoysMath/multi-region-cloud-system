import { useNavigate } from "react-router-dom";

/**
 * Landing page displayed to unauthenticated visitors.
 *
 * Renders a centered "Get Started" button that navigates the user to the login page.
 *
 * @returns The landing page JSX element.
 *
 * @example
 * <LandingPage />
 */
export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        className="px-12 py-6 text-2xl font-semibold rounded-2xl
                   bg-gradient-to-r from-blue-500 to-indigo-600
                   text-white shadow-2xl
                   transition-transform duration-200
                   hover:scale-105"
        onClick={() => navigate("/login")}
      >
        Get Started
      </button>
    </div>
  );
};

/**
 * Inline style definitions for the LandingPage component.
 *
 * @remarks
 * These styles are kept as a fallback alongside Tailwind classes.
 * `container` centres content vertically and horizontally over a dark background.
 * `button` applies the gradient, shadow, and hover transition to the CTA button.
 */
const styles = {
  /** Full-viewport dark container that centres its children. */
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
  /** Primary call-to-action button with a blue-to-indigo gradient. */
  button: {
    padding: "20px 50px",
    fontSize: "26px",
    fontWeight: "600",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease",
  },
};
