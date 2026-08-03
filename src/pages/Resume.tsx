import { Link } from 'react-router-dom';
import { ArrowLeft } from '@phosphor-icons/react';

export function ResumePage() {
  return (
    <div className="min-h-screen bg-background py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft weight="bold" className="size-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">Resume</h1>
        <p className="text-muted-foreground">
          Resume content coming soon...
        </p>
      </div>
    </div>
  );
}
