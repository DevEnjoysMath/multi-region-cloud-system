import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * ForgotPasswordPage component.
 *
 * Allows users to request a password reset.
 * Users can submit their email address
 * to receive reset instructions.
 *
 * This page integrates with the backend
 * password recovery endpoint.
 */
export function ForgotPasswordPage() {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <input
              type="email"
              className="w-full h-11 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700">
            Send reset link
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Back to{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            login
          </Link>
        </p>
      </div>
    </div>
  );
}
