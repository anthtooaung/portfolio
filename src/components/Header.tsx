import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { House, User, Folder, GearSix, PaperPlaneRight, List, X, FileText } from '@phosphor-icons/react';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const NAV_LINKS = [
  { label: 'Home', href: '#home', icon: House },
  { label: 'About', href: '#about', icon: User },
  { label: 'Projects', href: '#projects', icon: Folder },
  { label: 'Skills', href: '#skills', icon: GearSix },
  { label: 'Contact', href: '#contact', icon: PaperPlaneRight },
];

const SECTION_IDS = NAV_LINKS.map(({ href }) => href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const activeIdRef = useRef(NAV_LINKS[0].href.slice(1));
  const activeId = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Move the sliding indicator to the currently-active nav link.
  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const button = nav.querySelector<HTMLElement>(`[data-nav="${activeIdRef.current}"]`);
    if (!button) return;
    setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
  }, []);

  // Re-position when active section changes.
  useLayoutEffect(() => {
    activeIdRef.current = activeId;
    measure();
  }, [activeId, measure]);

  // Re-measure on nav resize (breakpoint reflow) and after fonts load.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(nav);
    document.fonts.ready.then(measure).catch(() => {});

    return () => resizeObserver.disconnect();
  }, [measure]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
          className="text-sm font-bold tracking-tight hover:text-primary transition-colors"
        >
          mr.ant<span className="text-muted-foreground">_</span>
        </a>

        {/* Desktop nav */}
        <nav ref={navRef} className="relative hidden md:flex items-center gap-1">
          {/* Sliding active indicator — animates transform, not left */}
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-md bg-primary/10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
            }}
          />
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const isActive = activeId === href.slice(1);
            return (
              <a
                key={href}
                data-nav={href.slice(1)}
                href={href}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors duration-300 ${
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon weight="bold" className="size-3.5" />
                {label}
              </a>
            );
          })}
          <Link
            to="/resume"
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-300"
          >
            <FileText weight="bold" className="size-3.5" />
            Resume
          </Link>
          <div className="w-px h-4 bg-border mx-1" />
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X weight="bold" className="size-3.5" /> : <List weight="bold" className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const isActive = activeId === href.slice(1);
              return (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors duration-300 ${
                    isActive
                      ? 'text-primary font-medium bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon weight="bold" className="size-3.5" />
                  {label}
                </a>
              );
            })}
            <Link
              to="/resume"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors duration-300"
            >
              <FileText weight="bold" className="size-3.5" />
              Resume
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
