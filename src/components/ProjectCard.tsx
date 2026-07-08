import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';

interface ProjectCardProps {
  title: string;
  tags?: string[];
  image?: string;
  description: string;
  demo?: string;
  repo?: string;
}

export function ProjectCard({
  title,
  tags = [],
  image,
  description,
  demo,
  repo,
}: ProjectCardProps) {
  return (
    <div className="group rounded-xl border bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      {/* Image area */}
      {image ? (
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/5 via-muted to-primary/10 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary/15">{title.charAt(0)}</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="prose prose-sm dark:prose-invert mb-4 text-muted-foreground leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-border">
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              <ArrowSquareOut weight="bold" className="size-3" />
              Live Demo
            </a>
          )}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubLogo weight="bold" className="size-3" />
              Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
