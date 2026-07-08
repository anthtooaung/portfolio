import { getProjects } from '@/lib/markdown';
import { ProjectCard } from './ProjectCard';
import { Folder } from '@phosphor-icons/react';

export function FeaturedProjects() {
  const projects = getProjects().filter((p) => p.meta.featured);

  if (projects.length === 0) return null;

  return (
    <section className="py-20 md:py-28" id="projects">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Folder weight="bold" className="size-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
        </div>
        <p className="text-muted-foreground mb-10 max-w-lg">
          A selection of projects I've built or contributed to.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={String(project.meta.title || 'Untitled Project')}
              tags={(project.meta.tags as string[]) || []}
              image={project.meta.image ? String(project.meta.image) : undefined}
              description={project.content}
              demo={project.meta.demo ? String(project.meta.demo) : undefined}
              repo={project.meta.repo ? String(project.meta.repo) : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
