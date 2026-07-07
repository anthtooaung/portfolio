// src/components/FeaturedProjects.tsx
import { getProjects } from '@/lib/markdown';
import { ProjectCard } from './ProjectCard';

export function FeaturedProjects() {
  const projects = getProjects().filter((p) => p.meta.featured);

  if (projects.length === 0) return null;

  return (
    <section className="py-16 md:py-24" id="projects">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.meta.title || 'Untitled Project'}
              tags={project.meta.tags || []}
              image={project.meta.image}
              description={project.content}
              demo={project.meta.demo}
              repo={project.meta.repo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
