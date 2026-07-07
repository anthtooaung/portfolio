// src/components/ContactSection.tsx
import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const contactData = getSection('home/contact.md');

interface Social {
  name: string;
  url: string;
}

export function ContactSection() {
  if (!contactData) return null;

  const { title, email, socials } = contactData.meta;
  const socialLinks: Social[] = socials || [];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{title || 'Contact'}</h2>
        <div className="prose prose-lg dark:prose-invert mb-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {contactData.content}
          </ReactMarkdown>
        </div>
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mb-6"
          >
            Email Me
          </a>
        )}
        {socialLinks.length > 0 && (
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
