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
    <div className="w-full overflow-hidden mt-12 animate-fade-up animation-delay-400">
      {/* Ribbon / medal bar */}
      <div className="relative">
        {/* Continuous ribbon line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-amber-500/30 -translate-y-1/2" />

        {/* Scrolling medals */}
        <div className="cert-marquee">
          <div className="cert-marquee-track">
            {/* Double the items for seamless loop */}
            {[...CERTS, ...CERTS].map(({ name, file, Icon }, i) => (
              <a
                key={`${file}-${i}`}
                href={`/certificates/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`${name} — click to view`}
                className="cert-medal shrink-0"
              >
                <span className="cert-medal-ribbon" />
                <Icon weight="fill" className="cert-medal-icon" style={{ color: AMBER }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cert-marquee {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
        .cert-marquee-track {
          display: flex;
          gap: 3rem;
          animation: cert-scroll 20s linear infinite;
          width: max-content;
        }
        .cert-medal {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          position: relative;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .cert-medal:hover {
          transform: scale(1.2) translateY(-4px);
        }
        .cert-medal-ribbon {
          width: 2px;
          height: 12px;
          background: linear-gradient(to bottom, ${AMBER}44, ${AMBER});
          border-radius: 0 0 1px 1px;
          margin-bottom: -2px;
        }
        .cert-medal-icon {
          width: 2rem;
          height: 2rem;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3));
          transition: filter 0.2s ease;
        }
        .cert-medal:hover .cert-medal-icon {
          filter: drop-shadow(0 2px 8px rgba(245, 158, 11, 0.6));
        }
        @keyframes cert-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cert-marquee-track {
            animation: none;
          }
          .cert-medal:hover {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
