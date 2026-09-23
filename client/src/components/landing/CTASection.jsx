import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Ready to feel free?
        </h2>
        
        <Link to="/login">
          <Button size="lg" className="mt-8 bg-purple-600 px-10 text-white hover:bg-purple-700">
            <Ghost className="mr-2 h-5 w-5" />
            Enter Shadowroom
          </Button>
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">
          You're safe here.
        </p>
      </div>
    </section>
  );
}