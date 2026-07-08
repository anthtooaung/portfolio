import { GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react';

const SOCIALS = [
  { name: 'GitHub', url: 'https://github.com/mrant', icon: GithubLogo },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/mrant', icon: LinkedinLogo },
  { name: 'Twitter', url: 'https://twitter.com/mrant', icon: TwitterLogo },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} mr.ant. Built with React &amp; Tailwind.
        </p>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ name, url, icon: Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={name}
            >
              <Icon weight="bold" className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
