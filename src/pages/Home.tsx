// src/pages/Home.tsx
import { HeroSection } from '@/components/HeroSection';
import { SkillsSection } from '@/components/SkillsSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ContactSection } from '@/components/ContactSection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <FeaturedProjects />
      <ContactSection />
    </main>
  );
}
