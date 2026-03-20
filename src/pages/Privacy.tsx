import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pokeball-pattern">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-lg text-foreground tracking-wide">PRIVACY POLICY</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-10 text-foreground">
        <p className="text-muted-foreground mb-6">Last updated: March 20, 2026</p>

        <section className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <div>
            <h2 className="font-display text-base text-foreground mb-2">Information We Collect</h2>
            <p>We collect minimal data needed to operate this Pokédex application. This includes Pokémon you choose to save and basic usage analytics to improve the service.</p>
          </div>

          <div>
            <h2 className="font-display text-base text-foreground mb-2">How We Use Your Data</h2>
            <p>Your saved Pokémon data is stored securely in our database to provide persistence across sessions. We do not sell or share your personal data with third parties.</p>
          </div>

          <div>
            <h2 className="font-display text-base text-foreground mb-2">Cookies &amp; Local Storage</h2>
            <p>We may use cookies or local storage to maintain your session and preferences. No tracking cookies from third-party advertisers are used.</p>
          </div>

          <div>
            <h2 className="font-display text-base text-foreground mb-2">Data Retention</h2>
            <p>Your saved Pokémon data is retained until you choose to remove it. You can release any saved Pokémon at any time from the Saved view.</p>
          </div>

          <div>
            <h2 className="font-display text-base text-foreground mb-2">Contact</h2>
            <p>If you have questions about this privacy policy, please reach out through the application's support channels.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
      </footer>
    </div>
  );
}
