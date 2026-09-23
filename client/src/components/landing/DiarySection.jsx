import { Lock, Clock, EyeOff } from "lucide-react";

const features = [
  {
    icon: Lock,
    text: "100% Private",
  },
  {
    icon: Clock,
    text: "Auto Delete Options",
  },
  {
    icon: EyeOff,
    text: "Only You Can See",
  },
];

export function DiarySection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-purple-900/30 via-card to-card">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Illustration side */}
            <div className="relative hidden h-64 items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50 lg:flex">
              <div className="relative">
                <div className="h-32 w-40 rounded-lg border-2 border-purple-400/30 bg-gradient-to-br from-purple-800/40 to-indigo-900/40 p-4 shadow-xl">
                  <div className="mb-2 flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-400/60" />
                    <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
                    <div className="h-2 w-2 rounded-full bg-green-400/60" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 rounded bg-purple-400/30" />
                    <div className="h-2 w-1/2 rounded bg-purple-400/30" />
                    <div className="h-2 w-2/3 rounded bg-purple-400/30" />
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 shadow-lg shadow-amber-200/20" />
              </div>
            </div>

            {/* Content side */}
            <div className="p-8 lg:p-12">
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                Some thoughts are just for you.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Use your private diary to write and reflect.<br />
                Auto-delete options keep your mind light.
              </p>

              <div className="mt-6 space-y-3">
                {features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20">
                      <feature.icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}