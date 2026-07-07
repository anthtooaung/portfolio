import { getSection } from '@/lib/markdown';

interface Skill {
  name: string;
  level: number;
}

export function SkillsSection() {
  const skillsData = getSection('home/skills.md');
  if (!skillsData) return null;

  const skills: Skill[] = (skillsData.meta.skills as Skill[]) || [];

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-lg border bg-card text-card-foreground"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
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
