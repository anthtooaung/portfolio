import certData from '@/content/certificates.json';

/** Single certificate entry */
export interface Certificate {
  id: string;
  title: string;
  skill: string;
  pdf: string;
  issuedDate: string;
}

/** Certificate database root */
interface CertDatabase {
  certificates: Certificate[];
}

/** Parsed certificate data */
const data = certData as CertDatabase;

/** Get all certificates */
export function getCertificates(): Certificate[] {
  return data.certificates;
}

/** Get a certificate by id */
export function getCertificateById(id: string): Certificate | undefined {
  return data.certificates.find((c) => c.id === id);
}

/** Get unique skills from all certificates */
export function getCertificateSkills(): string[] {
  return [...new Set(data.certificates.map((c) => c.skill))];
}

/** Calculate skill percentage based on certificate count for a given skill */
export function getSkillPercentage(skill: string, maxCerts = 3): number {
  const certsForSkill = data.certificates.filter((c) => c.skill === skill);
  const percentage = Math.min(100, Math.round((certsForSkill.length / maxCerts) * 100));
  return percentage;
}
