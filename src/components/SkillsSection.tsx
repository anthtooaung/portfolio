import { getSection } from '@/lib/markdown';
import { Lightbulb } from '@phosphor-icons/react';

interface Skill {
  name: string;
  level: number;
}

const SKILL_COLORS: Record<string, string> = {
  React: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  TypeScript: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'Node.js': 'bg-green-500/15 text-green-600 dark:text-green-400',
  'Tailwind CSS': 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  Python: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  PostgreSQL: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
};

function getSkillColor(name: string): string {
  return SKILL_COLORS[name] || 'bg-muted text-muted-foreground';
}

function getBarColor(name: string): string {
  const map: Record<string, string> = {
    React: 'bg-sky-500',
    TypeScript: 'bg-blue-500',
    'Node.js': 'bg-green-500',
    'Tailwind CSS': 'bg-cyan-500',
    Python: 'bg-amber-500',
    PostgreSQL: 'bg-indigo-500',
  };
  return map[name] || 'bg-primary';
}

export function SkillsSection() {
  const skillsData = getSection('home/skills.md');
  if (!skillsData) return null;

  const skills: Skill[] = (skillsData.meta.skills as Skill[]) || [];

  return (
    <section id="skills" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb weight="bold" className="size-5 text-muted-foreground" />
          <h2 className="text-3xl font-bold tracking-tight">Skills & Technologies</h2>
        </div>
        <p className="text-muted-foreground mb-8 max-w-lg">
          Tools and technologies I use to build modern web experiences.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group p-4 rounded-lg border bg-card hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${getSkillColor(skill.name)}`}>
                  {skill.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {skill.level}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 group-hover:opacity-100 ${getBarColor(skill.name)}`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
