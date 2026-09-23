import { Heart, MessageSquare, Bookmark, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const thoughts = [
  {
    mood: "Sad",
    moodColor: "bg-blue-500/20 text-blue-400",
    emoji: "😢",
    username: "Shadow_9421",
    time: "2h ago",
    content: "Some days, I feel invisible even when I'm around people.",
    relates: 43,
    comments: 27,
  },
  {
    mood: "Angry",
    moodColor: "bg-red-500/20 text-red-400",
    emoji: "😠",
    username: "Shadow_6712",
    time: "4h ago",
    content: "I hate how I always try so hard for people who don't even care.",
    relates: 32,
    comments: 18,
  },
  {
    mood: "Confused",
    moodColor: "bg-yellow-500/20 text-yellow-400",
    emoji: "😕",
    username: "Shadow_3310",
    time: "6h ago",
    content: "I don't even know what I want anymore. Everything feels so confusing right now.",
    relates: 21,
    comments: 11,
  },
];

export function RealThoughts() {
  return (
    <section className="border-y border-border bg-card/30 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-semibold text-foreground sm:text-3xl">
          Real thoughts from real people
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {thoughts.map((thought, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${thought.moodColor}`}>
                    <span>{thought.emoji}</span>
                    {thought.mood}
                  </span>
                  <span className="text-sm text-muted-foreground">{thought.username}</span>
                  <span className="text-xs text-muted-foreground">• {thought.time}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <p className="mb-4 text-sm text-foreground">{thought.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300">
                    <Heart className="h-4 w-4" />
                    I relate ({thought.relates})
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Comment ({thought.comments})
                  </button>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login">
            <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
              Explore More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}