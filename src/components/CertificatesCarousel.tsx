import { Certificate, Medal, GraduationCap, Star, Shield, BookOpen } from '@phosphor-icons/react';

const CERTS = [
  { name: 'Certificate 1', file: 'certificate-bwsddiaa3s3c-1785140297.pdf', Icon: Certificate },
  { name: 'Certificate 2', file: 'certificate-gu2huv8wu79r-1785045235.pdf', Icon: Medal },
  { name: 'Certificate 3', file: 'certificate-kss3uqvjvr7h-1781894910.pdf', Icon: GraduationCap },
  { name: 'Certificate 4', file: 'certificate-m4aup67k7vr7-1785048504.pdf', Icon: Star },
  { name: 'Certificate 5', file: 'certificate-txdjx8tkhpfb-1784876279.pdf', Icon: Shield },
  { name: 'Certificate 6', file: 'certificate-x7qxsdfhic9h-1785144854.pdf', Icon: BookOpen },
];

const AMBER = '#f59e0b';

export function CertificatesCarousel() {
  return (
    <div className="mt-14 animate-fade-up" style={{ animationDelay: '1200ms' }}>
      {/* Section label */}
      <p className="text-center text-xs font-medium text-muted-foreground/60 uppercase tracking-widest mb-5">
        Certifications
      </p>

      {/* Badge row */}
      <div className="cert-badge-row">
        {CERTS.map(({ name, file, Icon }, i) => (
          <a
            key={file}
            href={`/certificates/${file}`}
            target="_blank"
            rel="noopener noreferrer"
            title={`${name} — click to view`}
            className="cert-badge"
            style={{ animationDelay: `${1300 + i * 80}ms` }}
          >
            <span className="cert-badge-icon-wrap">
              <Icon weight="fill" className="cert-badge-icon" style={{ color: AMBER }} />
            </span>
            <span className="cert-badge-label">{name}</span>
          </a>
        ))}
      </div>

      <style>{`
        .cert-badge-row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .cert-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          text-decoration: none;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
          background: var(--card);
          transition: all 0.25s ease;
          cursor: pointer;
          animation: cert-badge-in 0.4s ease-out forwards;
          opacity: 0;
        }
        .cert-badge:hover {
          border-color: ${AMBER}66;
          background: ${AMBER}08;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px ${AMBER}15;
        }
        .cert-badge-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          transition: transform 0.25s ease;
        }
        .cert-badge:hover .cert-badge-icon-wrap {
          transform: scale(1.15);
        }
        .cert-badge-icon {
          width: 1.5rem;
          height: 1.5rem;
          display: block;
          filter: drop-shadow(0 1px 2px rgba(245, 158, 11, 0.2));
          transition: filter 0.25s ease;
        }
        .cert-badge:hover .cert-badge-icon {
          filter: drop-shadow(0 2px 6px rgba(245, 158, 11, 0.4));
        }
        .cert-badge-label {
          font-size: 0.625rem;
          font-weight: 500;
          color: var(--muted-foreground);
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: color 0.25s ease;
        }
        .cert-badge:hover .cert-badge-label {
          color: var(--foreground);
        }
        @keyframes cert-badge-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cert-badge {
            animation: none;
            opacity: 1;
          }
          .cert-badge:hover {
            transform: none;
          }
        }
        @media (max-width: 640px) {
          .cert-badge-row {
            gap: 0.5rem;
          }
          .cert-badge {
            padding: 0.5rem 0.75rem;
          }
          .cert-badge-label {
            font-size: 0.5625rem;
          }
        }
      `}</style>
    </div>
  );
}
