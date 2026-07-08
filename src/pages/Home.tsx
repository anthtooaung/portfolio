// src/pages/Home.tsx
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SkillsSection } from '@/components/SkillsSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { ContactSection } from '@/components/ContactSection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <FeaturedProjects />
      <ContactSection />
    </main>
  );
}
