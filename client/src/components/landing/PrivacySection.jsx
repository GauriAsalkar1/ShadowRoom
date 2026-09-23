import { Lock, Ghost, UserX, Shield } from "lucide-react";

const features = [
  {
    icon: Ghost,
    title: "Anonymous By Default",
  },
  {
    icon: UserX,
    title: "No Real Identity Sharing",
  },
  {
    icon: Shield,
    title: "Moderated & Safe Space",
  },
];

export function PrivacySection() {
  return (
    <section id="safety" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-600/20">
                <Lock className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Your privacy is our priority
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Your identity is never revealed.<br />
                  No names. No tracking. No judgment.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-end">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <feature.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="max-w-[100px] text-xs text-muted-foreground">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}