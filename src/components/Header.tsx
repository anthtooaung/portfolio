import { useState, useEffect } from 'react';
import { House, Folder, GearSix, PaperPlaneRight, Sun, Moon, List, X } from '@phosphor-icons/react';

const NAV_LINKS = [
  { label: 'Home', href: '#home', icon: House },
  { label: 'Projects', href: '#projects', icon: Folder },
  { label: 'Skills', href: '#skills', icon: GearSix },
  { label: 'Contact', href: '#contact', icon: PaperPlaneRight },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-300"
            >
              <Icon weight="bold" className="size-3.5" />
              {label}
            </a>
          ))}
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => setDark(!dark)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun weight="bold" className="size-3.5" /> : <Moon weight="bold" className="size-3.5" />}
          </button>
        </nav>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setDark(!dark)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun weight="bold" className="size-3.5" /> : <Moon weight="bold" className="size-3.5" />}
          </button>
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
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors duration-300"
              >
                <Icon weight="bold" className="size-3.5" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
