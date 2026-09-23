"use client";

import { Ghost, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
            <Ghost className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">Shadowroom</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link to="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link to="#safety" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Safety
          </Link>
          <Link to="#guidelines" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Guidelines
          </Link>
        </nav>

        <Link to="/login">
          <Button className="bg-purple-600 text-white hover:bg-purple-700">
            <ArrowRight className="mr-2 h-4 w-4" />
            Enter Anonymously
          </Button>
        </Link>
      </div>
    </header>
  );
}