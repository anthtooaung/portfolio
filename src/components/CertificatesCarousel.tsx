import { useState } from 'react';
import { getCertificates, type Certificate } from '@/lib/certs';
import { PdfViewer } from '@/components/PdfViewer';

const CERTS = getCertificates();

export function CertificatesCarousel() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const handleCertClick = (cert: Certificate) => {
    setSelectedCert(cert);
  };

  return (
    <section id="certificates" className="w-full overflow-hidden mt-12 animate-fade-up animation-delay-400">
      {/* Scrolling PDF previews */}
      <div className="cert-marquee">
        <div className="cert-marquee-track">
          {/* Double the items for seamless loop */}
          {[...CERTS, ...CERTS].map((cert, i) => (
            <div
              key={`${cert.pdf}-${i}`}
              onClick={() => handleCertClick(cert)}
              title={`${cert.title} — click to view full PDF`}
              className="cert-card shrink-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCertClick(cert);
                }
              }}
            >
              <object
                data={cert.pdf}
                type="application/pdf"
                className="cert-pdf"
                aria-label={cert.title}
                tabIndex={-1}
              >
                <div className="cert-pdf-fallback">{cert.title}</div>
              </object>
              <span className="cert-label">{cert.title}</span>
            </div>
          ))}
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
          gap: 1.5rem;
          animation: cert-scroll 30s linear infinite;
          width: max-content;
          align-items: stretch;
        }
        .cert-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          overflow: hidden;
          width: 12rem;
          flex-shrink: 0;
        }
        .cert-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .cert-pdf {
          width: 100%;
          height: 10rem;
          border: none;
          display: block;
        }
        .cert-pdf-fallback {
          width: 100%;
          height: 10rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
          font-size: 0.75rem;
          padding: 0.5rem;
          text-align: center;
        }
        .cert-label {
          padding: 0.5rem;
          font-size: 0.75rem;
          color: hsl(var(--foreground));
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        @keyframes cert-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cert-marquee-track {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          .cert-card:hover {
            transform: scale(1.02);
          }
        }
      `}</style>

      <PdfViewer
        src={selectedCert?.pdf ?? ''}
        title={selectedCert?.title ?? ''}
        open={selectedCert !== null}
        onOpenChange={(open) => { if (!open) setSelectedCert(null); }}
      />
    </section>
  );
}
