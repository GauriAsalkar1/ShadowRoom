import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const rooms = [
  {
    name: "Angry Room",
    description: "A place to vent your anger",
    emoji: "😠",
    gradient: "from-red-900/80 to-red-950/90",
    borderColor: "border-red-500/30",
    bgPattern: "bg-gradient-to-br from-red-900 via-orange-900 to-red-950",
  },
  {
    name: "Sad Room",
    description: "A place for your sadness",
    emoji: "😢",
    gradient: "from-blue-900/80 to-blue-950/90",
    borderColor: "border-blue-500/30",
    bgPattern: "bg-gradient-to-br from-blue-900 via-slate-800 to-blue-950",
  },
  {
    name: "Confused Room",
    description: "A place for your confusion",
    emoji: "😕",
    gradient: "from-yellow-900/80 to-amber-950/90",
    borderColor: "border-yellow-500/30",
    bgPattern: "bg-gradient-to-br from-yellow-900 via-amber-800 to-yellow-950",
  },
  {
    name: "Happy Room",
    description: "A place for your happiness",
    emoji: "😊",
    gradient: "from-green-900/80 to-green-950/90",
    borderColor: "border-green-500/30",
    bgPattern: "bg-gradient-to-br from-green-900 via-emerald-800 to-green-950",
  },
];

export function MoodRooms() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-semibold text-foreground sm:text-3xl">
          Explore Mood Rooms
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <Link
              key={room.name}
              to="/login"
              className={`group relative overflow-hidden rounded-2xl border ${room.borderColor} ${room.bgPattern} p-6 transition-transform hover:scale-[1.02]`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              </div>

              <div className="relative">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-2xl">{room.emoji}</span>
                  <h3 className="font-semibold text-white">{room.name}</h3>
                </div>
                <p className="mb-8 text-sm text-white/70">{room.description}</p>
                <div className="flex items-center justify-end">
                  <ArrowRight className="h-5 w-5 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}