const CERTS = [
  { name: 'Certificate 1', file: 'certificate-bwsddiaa3s3c-1785140297.pdf' },
  { name: 'Certificate 2', file: 'certificate-gu2huv8wu79r-1785045235.pdf' },
  { name: 'Certificate 3', file: 'certificate-kss3uqvjvr7h-1781894910.pdf' },
  { name: 'Certificate 4', file: 'certificate-m4aup67k7vr7-1785048504.pdf' },
  { name: 'Certificate 5', file: 'certificate-txdjx8tkhpfb-1784876279.pdf' },
  { name: 'Certificate 6', file: 'certificate-x7qxsdfhic9h-1785144854.pdf' },
];

export function CertificatesCarousel() {
  const handleCertClick = (file: string) => {
    window.open(`/certificates/${file}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full overflow-hidden mt-12 animate-fade-up animation-delay-400">
      {/* Scrolling PDF previews */}
      <div className="cert-marquee">
        <div className="cert-marquee-track">
          {/* Double the items for seamless loop */}
          {[...CERTS, ...CERTS].map(({ name, file }, i) => (
            <div
              key={`${file}-${i}`}
              onClick={() => handleCertClick(file)}
              title={`${name} — click to view full PDF`}
              className="cert-card shrink-0"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCertClick(file);
                }
              }}
            >
              <object
                data={`/certificates/${file}`}
                type="application/pdf"
                className="cert-pdf"
                aria-label={name}
                tabIndex={-1}
              >
                <div className="cert-pdf-fallback">{name}</div>
              </object>
              <span className="cert-label">{name}</span>
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
    </div>
  );
}
