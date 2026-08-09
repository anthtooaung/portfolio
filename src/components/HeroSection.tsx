import { getSection } from '@/lib/markdown';
import { ArrowDown } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { CertificatesCarousel } from '@/components/CertificatesCarousel';

/** Split text into individually animated characters */
function AnimatedText({ text, delayMs = 0 }: { text: string; delayMs?: number }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="hero-char-reveal"
          style={{ animationDelay: `${delayMs + i * 45}ms` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  );
}

/** Floating background particles — pure CSS, no JS animation loop */
function FloatingParticles() {
  const particles = [
    { x: 15, y: -40, dur: 8, delay: 0, size: 'sm' as const },
    { x: -20, y: 35, dur: 10, delay: 1.5, size: 'md' as const },
    { x: 30, y: -25, dur: 9, delay: 0.8, size: 'sm' as const },
    { x: -35, y: 45, dur: 11, delay: 2.2, size: 'lg' as const },
    { x: 25, y: -50, dur: 7, delay: 3.0, size: 'sm' as const },
    { x: -15, y: 30, dur: 12, delay: 0.3, size: 'md' as const },
    { x: 40, y: -20, dur: 9.5, delay: 1.8, size: 'sm' as const },
    { x: -25, y: 50, dur: 8.5, delay: 2.5, size: 'lg' as const },
    { x: 10, y: -35, dur: 10.5, delay: 1.0, size: 'md' as const },
    { x: -30, y: 40, dur: 7.5, delay: 3.5, size: 'sm' as const },
    { x: 35, y: -15, dur: 11.5, delay: 0.5, size: 'md' as const },
    { x: -10, y: 55, dur: 9, delay: 2.0, size: 'sm' as const },
    { x: 20, y: -45, dur: 8, delay: 1.2, size: 'lg' as const },
    { x: -40, y: 20, dur: 10, delay: 2.8, size: 'sm' as const },
    { x: 5, y: -30, dur: 12, delay: 0.7, size: 'md' as const },
    { x: -20, y: 60, dur: 7, delay: 3.2, size: 'sm' as const },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className={`hero-particle hero-particle-${p.size}`}
          style={{
            left: `${50 + p.x}%`,
            top: `${50 + p.y * 0.6}%`,
            '--px': `${p.x * 0.5}px`,
            '--py': `${p.y * 0.4}px`,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  const hero = getSection('home/hero.md');
  if (!hero) return null;

  const title = String(hero.meta.title || 'Hello');
  const subtitle = hero.meta.subtitle ? String(hero.meta.subtitle) : null;
  const cta = hero.meta.cta ? String(hero.meta.cta) : null;
  const ctaLink = hero.meta.ctaLink ? String(hero.meta.ctaLink) : null;

  /** Stagger base delay: title characters start at 200ms, each char adds 45ms */
  const titleEnd = 200 + title.length * 45;

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center overflow-hidden scroll-mt-14">
      {/* Floating particles */}
      <FloatingParticles />

      {/* Subtle grid background — reduced opacity for cleaner look */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* Soft radial glow behind hero content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 w-full py-24">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="max-w-2xl flex-1">
            {/* Terminal-style status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-8 animate-fade-up">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              available for work
            </div>

            {/* Title with animated gradient + character reveal */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              <span className="text-gradient-animated">
                <AnimatedText text={title} delayMs={200} />
              </span>
              <span
                className="text-primary animate-cursor-blink font-mono hero-char-reveal"
                style={{ animationDelay: `${titleEnd + 100}ms` }}
              >
                _
              </span>
            </h1>

            {/* Subtitle — fade-in instead of char-by-char (too long for per-char) */}
            {subtitle && (
              <p
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed animate-fade-up"
                style={{ animationDelay: `${titleEnd + 400}ms` }}
              >
                {subtitle}
              </p>
            )}

            {/* CTA buttons */}
            <div
              className="flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${titleEnd + 600}ms` }}
            >
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

          {/* Profile photo with orbiting certificates */}
          <div
            className="shrink-0 cert-orbit-container animate-fade-up"
            style={{ animationDelay: `${titleEnd + 300}ms` }}
          >
            <CertificatesCarousel />
            <div className="hero-glow-ring">
              <img
                src="/profile.jpg"
                alt="Ant Htoo Aung"
                className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-lg relative z-[1]"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-muted-foreground animate-bounce animate-fade-up"
          style={{ animationDelay: `${titleEnd + 800}ms` }}
        >
          <ArrowDown weight="bold" className="size-4" />
        </div>
      </div>
    </section>
  );
}
