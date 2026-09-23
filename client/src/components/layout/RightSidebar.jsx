"use client";

import { Shield, Heart, User, Star, Clock, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";

const moodEmojis = ["😠", "😢", "😕", "😊"];

const safeSpaceItems = [
  { icon: Shield, text: "Your identity is always protected", color: "text-green-400" },
  { icon: Heart, text: "No judgment, only understanding", color: "text-pink-400" },
  { icon: User, text: "You're free to be you", color: "text-purple-400" },
  { icon: Star, text: "We're here, always.", color: "text-yellow-400" },
];

export function RightSidebar({ onMoodSelect }) {
  const navigate = useNavigate();
  return (
    <aside className="w-80 p-6 border-l border-border overflow-y-auto">
      {/* How are you feeling */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-white mb-1">How are you feeling today?</h3>
        <p className="text-xs text-muted-foreground mb-4">It's okay to not be okay.</p>
        <div className="flex items-center gap-3">
          {moodEmojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onMoodSelect && onMoodSelect(emoji)}
              className="w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-xl transition-colors hover:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Your Safe Space */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-white mb-4">Your Safe Space</h3>
        <div className="space-y-3">
          {safeSpaceItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Auto Delete Posts */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-white mb-2">Auto Delete Posts</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Your posts will be automatically deleted after the selected time.
        </p>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer">
            <option>3 Days</option>
            <option>7 Days</option>
            <option>14 Days</option>
            <option>30 Days</option>
            <option>Never</option>
          </select>
        </div>
      </div>

      {/* Community Reminder */}
      <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-2xl p-5 mb-4 relative overflow-hidden">
        <h3 className="font-semibold text-white mb-2">Community Reminder</h3>
        <p className="text-sm text-purple-200/80 leading-relaxed">
          "Be kind, even in the dark. You never know what someone is going through."
        </p>
        <div className="absolute top-2 right-2">
          <Star className="w-3 h-3 text-purple-400/60" />
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-purple-500/40 flex items-center justify-center">
              <span className="text-lg">🔮</span>
            </div>
          </div>
        </div>
      </div>

      
    </aside>
  );
}