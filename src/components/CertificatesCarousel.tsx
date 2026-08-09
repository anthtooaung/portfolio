import { Certificate, Medal, GraduationCap, Star, Shield, BookOpen } from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { ForwardRefExoticComponent } from 'react';

const CERTS = [
  { name: 'Certificate 1', file: 'certificate-bwsddiaa3s3c-1785140297.pdf', Icon: Certificate },
  { name: 'Certificate 2', file: 'certificate-gu2huv8wu79r-1785045235.pdf', Icon: Medal },
  { name: 'Certificate 3', file: 'certificate-kss3uqvjvr7h-1781894910.pdf', Icon: GraduationCap },
  { name: 'Certificate 4', file: 'certificate-m4aup67k7vr7-1785048504.pdf', Icon: Star },
  { name: 'Certificate 5', file: 'certificate-txdjx8tkhpfb-1784876279.pdf', Icon: Shield },
  { name: 'Certificate 6', file: 'certificate-x7qxsdfhic9h-1785144854.pdf', Icon: BookOpen },
] as const;

/** Orbiting badge — counter-rotates to stay upright while the ring spins */
function OrbitBadge({
  name,
  file,
  Icon,
  angle,
}: {
  name: string;
  file: string;
  Icon: ForwardRefExoticComponent<IconProps>;
  angle: number;
}) {
  return (
    <a
      href={`/certificates/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`${name} — click to view`}
      className="cert-orbit-badge"
      style={{
        transform: `rotate(${angle}deg) translate(0, calc(-1 * var(--cert-orbit-radius))) rotate(${-angle}deg)`,
      }}
    >
      <Icon weight="fill" className="size-3.5 text-primary" />
      <span className="cert-orbit-badge-label">{name}</span>
    </a>
  );
}

/**
 * Certificates orbiting around the profile photo.
 * Rendered as a child of HeroSection — the parent provides the glow-ring wrapper.
 * On mobile / reduced-motion, falls back to a static ring.
 */
export function CertificatesCarousel() {
  return (
    <div className="cert-orbit-ring">
      {/* Orbit track ring */}
      <div className="cert-orbit-track" />

      {/* Spinning container */}
      <div className="cert-orbit-spin">
        {CERTS.map(({ name, file, Icon }, i) => (
          <OrbitBadge
            key={file}
            name={name}
            file={file}
            Icon={Icon}
            angle={(360 / CERTS.length) * i}
          />
        ))}
      </div>
    </div>
  );
}
