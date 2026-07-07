import { getSection } from '@/lib/markdown';

export function HeroSection() {
  const hero = getSection('home/hero.md');
  if (!hero) return null;

  const title = String(hero.meta.title || 'Hello');
  const subtitle = hero.meta.subtitle ? String(hero.meta.subtitle) : null;
  const cta = hero.meta.cta ? String(hero.meta.cta) : null;
  const ctaLink = hero.meta.ctaLink ? String(hero.meta.ctaLink) : null;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {title}
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
