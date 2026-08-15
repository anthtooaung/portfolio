import { useState, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ArrowSquareOut, FileText, GraduationCap, Briefcase, GearSix, Trophy } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { PdfViewer } from '@/components/PdfViewer';
import { getSection } from '@/lib/markdown';

interface ResumeItem {
  title?: string;
  organization?: string;
  period?: string;
  details?: string[];
}

interface ResumeSection {
  heading?: string;
  items?: ResumeItem[];
}

const SECTION_ICONS: Record<string, ElementType> = {
  Experience: Briefcase,
  Education: GraduationCap,
  Skills: GearSix,
  Certifications: Trophy,
};

export function ResumePage() {
  const [pdfOpen, setPdfOpen] = useState(false);
  const resume = getSection('resume.md');
  if (!resume) return null;

  const title = String(resume.meta.title || 'Resume');
  const subtitle = resume.meta.subtitle ? String(resume.meta.subtitle) : null;
  const pdf = resume.meta.pdf ? String(resume.meta.pdf) : null;
  const sections = (resume.meta.sections as ResumeSection[]) || [];

  const handleDownload = () => {
    if (!pdf) return;
    const link = document.createElement('a');
    link.href = pdf;
    link.download = 'resume.pdf';
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-medium mb-4">
              <FileText weight="bold" className="size-3.5" />
              Resume
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground max-w-lg">{subtitle}</p>
            )}
          </div>

          {/* PDF actions */}
          {pdf && (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setPdfOpen(true)}>
                <ArrowSquareOut weight="bold" className="size-3.5 mr-1.5" />
                View PDF
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download weight="bold" className="size-3.5 mr-1.5" />
                Download
              </Button>
            </div>
          )}
        </div>

        {/* Resume sections */}
        <div className="space-y-8">
          {sections.map((section, i) => {
            const Icon = SECTION_ICONS[section.heading || ''] || Briefcase;
            return (
              <section key={i} className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Icon weight="bold" className="size-5 text-primary" />
                  <h2 className="text-lg font-bold tracking-tight">{section.heading}</h2>
                </div>

                <div className="space-y-5">
                  {section.items?.map((item, j) => (
                    <div key={j} className="relative pl-5 border-l-2 border-border">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 mb-1.5">
                      <div>
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                        {item.organization && (
                          <span className="text-xs text-muted-foreground">{item.organization}</span>
                        )}
                      </div>
                      {item.period && (
                        <span className="text-xs text-muted-foreground font-mono shrink-0">{item.period}</span>
                      )}
                      </div>
                      {item.details && item.details.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.details.map((detail, k) => (
                            <li key={k} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                              <span className="size-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Last updated — {new Date().getFullYear()}
        </p>
      </div>

      {/* PDF Viewer modal */}
      {pdf && (
        <PdfViewer
          src={pdf}
          title={title}
          open={pdfOpen}
          onOpenChange={setPdfOpen}
          showDownload={true}
        />
      )}
    </div>
  );
}
