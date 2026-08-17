import certData from '@/content/certificates.json';

/** Single certificate entry */
export interface Certificate {
  id: string;
  title: string;
  skill: string;
  pdf: string;
  issuedDate: string;
}

/** Skill definition */
export interface Skill {
  name: string;
  slug: string;
  level: number | null;
}

/** Certificate database root */
interface CertDatabase {
  skills: Skill[];
  certificates: Certificate[];
}

/** Parsed certificate data */
const data = certData as CertDatabase;

/** Get all skills */
export function getSkills(): Skill[] {
  return data.skills;
}

/** Get all certificates */
export function getCertificates(): Certificate[] {
  return data.certificates;
}

/** Get certificates filtered by skill slug */
export function getCertificatesBySkill(slug: string): Certificate[] {
  return data.certificates.filter((c) => c.skill === slug);
}

/** Get a certificate by id */
export function getCertificateById(id: string): Certificate | undefined {
  return data.certificates.find((c) => c.id === id);
}

/** Get unique skills from all certificates */
export function getCertificateSkills(): string[] {
  return [...new Set(data.certificates.map((c) => c.skill))];
}

/**
 * Calculate skill level percentage.
 * Base 20% + 10% per certificate, capped at 100%.
 * If the skill has a manual `level` override, use that instead.
 */
export function getSkillLevel(slug: string): number {
  const skill = data.skills.find((s) => s.slug === slug);
  if (skill?.level !== null && skill?.level !== undefined) {
    return skill.level;
  }
  const certCount = getCertificatesBySkill(slug).length;
  return Math.min(100, 20 + certCount * 10);
}
