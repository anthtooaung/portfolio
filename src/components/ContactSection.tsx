import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react';

interface Social {
  name: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, typeof GithubLogo> = {
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  Twitter: TwitterLogo,
};

export function ContactSection() {
  const contactData = getSection('home/contact.md');
  if (!contactData) return null;

  const title = contactData.meta.title ? String(contactData.meta.title) : "Let's work together";
  const email = contactData.meta.email ? String(contactData.meta.email) : null;
  const socials = (contactData.meta.socials as Social[]) || [];

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-xl">
          {/* Inviting heading */}
          <h2 className="text-3xl font-bold tracking-tight mb-2 animate-fade-up">
            {title}
          </h2>

          <div className="prose prose-lg dark:prose-invert mb-8 text-muted-foreground animate-fade-up animation-delay-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contactData.content}
            </ReactMarkdown>
          </div>

          {/* Terminal-style email block */}
          {email && (
            <div className="animate-fade-up animation-delay-200">
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-muted transition-all duration-300"
              >
                <span className="text-primary font-bold font-mono">{'>'}</span>
                <span className="text-foreground group-hover:text-primary transition-colors">
                  {email}
                </span>
              </a>
            </div>
          )}

          {/* Social links */}
          {socials.length > 0 && (
            <div className="flex items-center gap-3 mt-8 animate-fade-up animation-delay-300">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.name];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-full hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                  >
                    {Icon && <Icon weight="bold" className="size-3" />}
                    {social.name}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
