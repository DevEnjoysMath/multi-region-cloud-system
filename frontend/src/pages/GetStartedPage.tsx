import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function GetStartedPage() {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-10 space-y-6 text-center">
        <h1 className="text-4xl font-bold">Welcome 👋</h1>
        <p className="text-muted-foreground text-lg">
          Order food and drinks quickly and easily.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <Button asChild className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700">
            <Link to="/login">Get started</Link>
          </Button>

          <Button asChild variant="outline" className="h-11 px-6">
            <Link to="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
