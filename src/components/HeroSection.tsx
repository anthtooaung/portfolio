import { getSection } from '@/lib/markdown';
import { ArrowDown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const hero = getSection('home/hero.md');
  if (!hero) return null;

  const title = String(hero.meta.title || 'Hello');
  const subtitle = hero.meta.subtitle ? String(hero.meta.subtitle) : null;
  const cta = hero.meta.cta ? String(hero.meta.cta) : null;
  const ctaLink = hero.meta.ctaLink ? String(hero.meta.ctaLink) : null;

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          {/* Terminal-style status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/50 text-xs text-muted-foreground mb-6 animate-fade-up">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            available for work
          </div>

          {/* Title with blinking cursor */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-[1.1] animate-fade-up animation-delay-100">
            {title}
            <span className="text-amber-500 animate-cursor-blink">_</span>
          </h1>

          {subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed animate-fade-up animation-delay-200">
              {subtitle}
            </p>
          )}

          <div className="flex items-center gap-3 animate-fade-up animation-delay-300">
            {cta && ctaLink && (
              <Button asChild size="lg">
                <a href={ctaLink}>{cta}</a>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <a href="#contact">Get in Touch</a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground animate-bounce animate-fade-up animation-delay-400">
          <ArrowDown weight="bold" className="size-4" />
        </div>
      </div>
    </section>
  );
}
