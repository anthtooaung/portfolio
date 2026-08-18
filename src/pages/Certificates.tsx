import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ArrowSquareOut, Trophy } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PdfViewer } from '@/components/PdfViewer';
import { getCertificates, getSkills, getCertificatesBySkill, type Certificate } from '@/lib/certs';

export function CertificatesPage() {
  const { skill } = useParams<{ skill: string }>();
  const [viewerCert, setViewerCert] = useState<Certificate | null>(null);

  const skills = getSkills();
  const activeSkill = skill ? skills.find((s) => s.slug === skill) : null;
  const certs = skill ? getCertificatesBySkill(skill) : getCertificates();

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
      <div className="max-w-6xl mx-auto px-4">
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
            {activeSkill ? activeSkill.name : 'Certificates'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {activeSkill ? `${activeSkill.name} Certificates` : 'My Certificates'}
          </h1>
          <p className="text-muted-foreground max-w-lg">
            {activeSkill
              ? `View and download my ${activeSkill.name} certifications.`
              : 'View and download my professional certifications.'}
          </p>
        </div>

        {/* Skill filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            to="/certificates"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !skill
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30'
            }`}
          >
            All
          </Link>
          {skills.map((s) => (
            <Link
              key={s.slug}
              to={`/certificates/${s.slug}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                skill === s.slug
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              {s.name}
            </Link>
          ))}
        </div>

        {/* Certificate grid */}
        {certs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No certificates found for this skill.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="group rounded-xl border bg-card p-3 flex flex-col hover:border-primary/30 hover:bg-card/80 transition-all duration-200"
              >
                {/* PDF Preview */}
                <div
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted cursor-pointer mb-3"
                  onClick={() => setViewerCert(cert)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setViewerCert(cert);
                    }
                  }}
                >
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

                {/* Certificate name */}
                <h2 className="text-sm font-semibold truncate mb-3">{cert.title}</h2>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setViewerCert(cert)}
                  >
                    <ArrowSquareOut weight="bold" className="size-3.5 mr-1" />
                    Open
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download weight="bold" className="size-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          {certs.length} certificate{certs.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* PDF Viewer Modal */}
      <PdfViewer
        src={viewerCert?.pdf ?? ''}
        title={viewerCert?.title ?? ''}
        open={viewerCert !== null}
        onOpenChange={(open) => { if (!open) setViewerCert(null); }}
      />
    </div>
  );
}
