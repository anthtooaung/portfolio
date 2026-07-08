import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PaperPlaneRight, EnvelopeSimple, GithubLogo, LinkedinLogo, TwitterLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

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

  const title = String(contactData.meta.title || 'Contact');
  const email = contactData.meta.email ? String(contactData.meta.email) : null;
  const socials = (contactData.meta.socials as Social[]) || [];

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <PaperPlaneRight weight="bold" className="size-5 text-muted-foreground" />
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert mb-6 text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contactData.content}
            </ReactMarkdown>
          </div>

          {email && (
            <Button asChild size="lg" className="mb-8">
              <a href={`mailto:${email}`}>
                <EnvelopeSimple weight="bold" className="size-4" />
                Email Me
              </a>
            </Button>
          )}

          {socials.length > 0 && (
            <div className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.name];
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-md hover:bg-muted hover:text-foreground transition-colors"
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
