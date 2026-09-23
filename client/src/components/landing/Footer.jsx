import { Ghost, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  explore: [
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Guidelines", href: "#guidelines" },
  ],
  support: [
    { label: "Safety", href: "#safety" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Contact", href: "#contact" },
  ],
  community: [
    { label: "Our Mission", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Feedback", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
                <Ghost className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">Shadowroom</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              A safe place for thoughts you can't say out loud.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Explore</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; 2025 Shadowroom. All thoughts are anonymous.
          </p>

          <div className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2">
            <span className="text-sm text-foreground">You matter.</span>
            <Heart className="h-4 w-4 text-pink-400" />
            <span className="text-xs text-muted-foreground">Thank you for being here.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}