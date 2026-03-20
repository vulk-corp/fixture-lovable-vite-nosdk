import React from "react";
import { Link } from "react-router-dom";

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background pokeball-pattern">
          <div className="text-center px-6">
            <p className="font-display text-4xl text-destructive mb-4">Oops!</p>
            <h1 className="font-display text-lg text-foreground mb-4">Something Went Wrong</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              An unexpected error occurred. Try refreshing the page or head back to the Pokédex.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-6 py-3 text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Refresh Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Return to Pokédex
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
