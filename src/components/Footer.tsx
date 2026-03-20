import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <Link to="/privacy" className="hover:text-foreground transition-colors">
        Privacy Policy
      </Link>
    </footer>
  );
}
