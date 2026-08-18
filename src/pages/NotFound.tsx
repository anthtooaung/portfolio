import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft weight="bold" className="size-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
