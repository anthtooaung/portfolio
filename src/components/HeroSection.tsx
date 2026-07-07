// src/components/HeroSection.tsx
import { getSection } from '@/lib/markdown';

const hero = getSection('home/hero.md');

export function HeroSection() {
  if (!hero) return null;

  const { title, subtitle, cta, ctaLink } = hero.meta;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title || 'Hello'}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          {cta && ctaLink && (
            <a
              href={ctaLink}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {cta}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
