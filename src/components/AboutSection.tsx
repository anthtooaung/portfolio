import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Lightbulb, ChartBar, TrendUp } from '@phosphor-icons/react';

interface AboutCard {
  title: string;
  description: string;
}

// Icons that match the original project's intent: wrench/code, lightbulb, chart
const CARD_ICONS = [Lightbulb, ChartBar, TrendUp];

export function AboutSection() {
  const aboutData = getSection('home/about.md');
  if (!aboutData) return null;

  const cards: AboutCard[] = (aboutData.meta.cards as AboutCard[]) || [];

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <User weight="bold" className="size-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">{String(aboutData.meta.title || 'About Me')}</h2>
        </div>

        <div className="prose prose-lg dark:prose-invert text-muted-foreground mb-10 max-w-2xl mx-auto text-center">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {aboutData.content}
          </ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = CARD_ICONS[i] || User;
            return (
              <div
                key={card.title}
                className="group p-6 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <Icon weight="bold" className="size-8 text-primary mb-4" />
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
