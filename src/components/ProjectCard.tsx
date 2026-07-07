// src/components/ProjectCard.tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    <div className="group rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md">
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="prose prose-sm dark:prose-invert mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>
        <div className="flex gap-3">
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Live Demo →
            </a>
          )}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              Source Code →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
