// src/pages/Home.tsx
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { SkillsSection } from '@/components/SkillsSection';
import { CertificatesSection } from '@/components/CertificatesSection';
import { ContactSection } from '@/components/ContactSection';

export function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeaturedProjects />
      <SkillsSection />
      <CertificatesSection />
      <ContactSection />
    </main>
  );
}
