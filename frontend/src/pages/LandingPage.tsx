import { useNavigate } from "react-router-dom";

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

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
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
