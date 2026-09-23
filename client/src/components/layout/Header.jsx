"use client";

import { Search, Moon, Feather } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

export function Header({ onOpenComposer }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search thoughts, feelings or users..."
              className="w-full bg-secondary/50 border border-border rounded-full pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-6">
          
          <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
            <Moon className="w-5 h-5 text-muted-foreground" />
          </button>

          <Button
            onClick={onOpenComposer}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-2 flex items-center gap-2"
          >
            <Feather className="w-4 h-4" />
            <span>Release Thought</span>
          </Button>

        </div>
      </div>
    </header>
  );
}