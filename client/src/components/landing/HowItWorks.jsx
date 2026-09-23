import { Ghost, Feather, Heart } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Ghost,
    title: "Stay Anonymous",
    description: "You are assigned a random identity. No personal data exposed.",
    color: "bg-purple-600",
  },
  {
    number: "02",
    icon: Feather,
    title: "Express Freely",
    description: "Share thoughts, emotions, and moments without fear.",
    color: "bg-purple-600",
  },
  {
    number: "03",
    icon: Heart,
    title: "Feel Less Alone",
    description: "Others can relate, respond, or simply listen.",
    color: "bg-pink-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-2xl font-semibold text-foreground sm:text-3xl">
          How It Works
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.color}`}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <span className="absolute bottom-4 right-4 text-4xl font-bold text-muted-foreground/20">
                {step.number}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}