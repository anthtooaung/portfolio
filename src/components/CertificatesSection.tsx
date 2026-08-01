import { Certificate, Medal, GraduationCap, Star, Shield, BookOpen } from '@phosphor-icons/react';

const CERTS = [
  { name: 'Certificate 1', slug: 'certificate-bwsddiaa3s3c', file: 'certificate-bwsddiaa3s3c-1785140297.pdf', Icon: Certificate },
  { name: 'Certificate 2', slug: 'certificate-gu2huv8wu79r', file: 'certificate-gu2huv8wu79r-1785045235.pdf', Icon: Medal },
  { name: 'Certificate 3', slug: 'certificate-kss3uqvjvr7h', file: 'certificate-kss3uqvjvr7h-1781894910.pdf', Icon: GraduationCap },
  { name: 'Certificate 4', slug: 'certificate-m4aup67k7vr7', file: 'certificate-m4aup67k7vr7-1785048504.pdf', Icon: Star },
  { name: 'Certificate 5', slug: 'certificate-txdjx8tkhpfb', file: 'certificate-txdjx8tkhpfb-1784876279.pdf', Icon: Shield },
  { name: 'Certificate 6', slug: 'certificate-x7qxsdfhic9h', file: 'certificate-x7qxsdfhic9h-1785144854.pdf', Icon: BookOpen },
];

const AMBER = '#f59e0b';

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-20 md:py-28 scroll-mt-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <Certificate weight="bold" className="size-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
        </div>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Certifications and credentials earned.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {CERTS.map(({ name, file, slug, Icon }) => (
            <a
              key={slug}
              href={`/certificates/${file}`}
              target="_blank"
              rel="noopener noreferrer"
              title={`${name} — click to view`}
              className="group cert-ico-link"
              style={{ color: AMBER }}
            >
              <Icon
                weight="fill"
                className="cert-ico"
              />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .cert-ico-link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .cert-ico-link:hover {
          transform: scale(1.25);
          filter: drop-shadow(0 0 6px currentColor);
        }
        .cert-ico {
          width: 2rem;
          height: 2rem;
          display: block;
        }
        @media (prefers-reduced-motion: reduce) {
          .cert-ico-link { transition: none; }
          .cert-ico-link:hover { transform: none; }
        }
      `}</style>
    </section>
  );
}
