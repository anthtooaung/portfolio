import { getSection } from '@/lib/markdown';
import { Lightbulb } from '@phosphor-icons/react';

interface Skill {
  name: string;
  level: number;
}

export function SkillsSection() {
  const skillsData = getSection('home/skills.md');
  if (!skillsData) return null;

  const skills: Skill[] = (skillsData.meta.skills as Skill[]) || [];

  return (
    <section id="skills" className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb weight="bold" className="size-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Skills & Technologies</h2>
        </div>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Tools and technologies I use to build modern web experiences.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {skill.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono font-medium">
                  {skill.level}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
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
