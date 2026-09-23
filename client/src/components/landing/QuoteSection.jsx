import { Heart } from "lucide-react";

export function QuoteSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-900/20 via-purple-800/10 to-purple-900/20" />
      
      <div className="pointer-events-none absolute left-10 top-1/4 text-purple-400/30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 4 3 5v7h6v-7c2-1 3-3 3-5 0-3.5-2.5-6-6-6z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-10 top-1/3 text-purple-400/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 4 3 5v7h6v-7c2-1 3-3 3-5 0-3.5-2.5-6-6-6z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-1/4 right-20 text-purple-400/20">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 4 3 5v7h6v-7c2-1 3-3 3-5 0-3.5-2.5-6-6-6z" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block text-4xl text-purple-400/50">&ldquo;</span>
        
        <blockquote className="text-xl font-medium italic text-purple-300 sm:text-2xl">
          Not everything needs to be solved.<br />
          Some things just need to be felt.
        </blockquote>

        <div className="mt-6 flex justify-center">
          <Heart className="h-6 w-6 text-purple-400/60" />
        </div>
      </div>
    </section>
  );
}