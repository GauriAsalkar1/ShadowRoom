import { Ghost } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background" />
      
      {/* Stars decoration */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              A safe place for{" "}
              <span className="block">thoughts you</span>
              <span className="block">
                can't say <span className="text-purple-400">out loud.</span>
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Anonymous. Private. No judgment.
            </p>
            <Link to="/login">
              <Button size="lg" className="mt-8 bg-purple-600 px-8 text-white hover:bg-purple-700">
                <Ghost className="mr-2 h-5 w-5" />
                Enter Shadowroom
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              No sign-up. No identity. Just you.
            </p>
          </div>

          {/* Hero illustration */}
          <div className="relative hidden lg:block">
            <div className="relative h-80 w-full">
              {/* Moon */}
              <div className="absolute right-20 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 shadow-lg shadow-amber-200/30" />
              
              {/* Silhouette figure on cliff */}
              <div className="absolute bottom-0 right-0 h-48 w-64">
                <svg viewBox="0 0 200 150" className="h-full w-full">
                  <path
                    d="M100 150 L200 150 L200 80 Q180 70 160 85 Q140 60 120 75 Q100 50 100 150"
                    fill="currentColor"
                    className="text-foreground/90"
                  />
                  <ellipse cx="140" cy="60" rx="8" ry="10" fill="currentColor" className="text-foreground/90" />
                  <path
                    d="M130 70 Q135 80 145 85 L150 75 Q145 70 140 70 Z"
                    fill="currentColor"
                    className="text-foreground/90"
                  />
                  <path
                    d="M135 85 L130 100 L145 100 L150 85"
                    fill="currentColor"
                    className="text-foreground/90"
                  />
                </svg>
              </div>

              {/* Decorative plants */}
              <div className="absolute bottom-0 left-10 text-purple-400/60">
                <svg width="40" height="60" viewBox="0 0 40 60">
                  <path d="M20 60 L20 30 Q10 20 15 10 Q20 15 20 30" fill="currentColor" />
                  <path d="M20 60 L20 35 Q30 25 25 15 Q20 20 20 35" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}