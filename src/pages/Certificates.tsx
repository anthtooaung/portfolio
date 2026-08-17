import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ArrowSquareOut, Trophy } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { getCertificates, type Certificate } from '@/lib/certs';

const CERTS = getCertificates();

export function CertificatesPage() {
  const handleOpen = (cert: Certificate) => {
    window.open(cert.pdf, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (cert: Certificate) => {
    const link = document.createElement('a');
    link.href = cert.pdf;
    link.download = cert.title;
    link.target = '_blank';
    link.rel = 'noopener,noreferrer';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft weight="bold" className="size-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-4">
            <Trophy weight="bold" className="size-3.5" />
            Certificates
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">My Certificates</h1>
          <p className="text-muted-foreground max-w-lg">
            View and download my professional certifications.
          </p>
        </div>

        {/* Certificate list */}
        <div className="space-y-4">
          {CERTS.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-xl border bg-card p-4 sm:p-5 flex flex-col sm:flex-row items-stretch gap-4 hover:border-primary/30 hover:bg-card/80 transition-all duration-200 cursor-pointer"
              onClick={() => handleOpen(cert)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpen(cert);
                }
              }}
            >
              {/* PDF Preview */}
              <div className="shrink-0 w-full sm:w-40 h-32 sm:h-28 rounded-lg overflow-hidden border border-border bg-muted">
                <object
                  data={cert.pdf}
                  type="application/pdf"
                  className="w-full h-full"
                  aria-label={cert.title}
                  tabIndex={-1}
                >
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
                    {cert.title}
                  </div>
                </object>
              </div>

              {/* Info + actions */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-semibold truncate">{cert.title}</h2>
                  <span className="text-xs text-muted-foreground">{cert.skill}</span>
                  {cert.issuedDate && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      Issued: {new Date(cert.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpen(cert)}
                  >
                    <ArrowSquareOut weight="bold" className="size-3.5 mr-1.5" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download weight="bold" className="size-3.5 mr-1.5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          {CERTS.length} certificates total
        </p>
      </div>
    </div>
  );
}
