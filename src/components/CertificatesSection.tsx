import { FilePdf } from '@phosphor-icons/react';

const CERTIFICATES = [
  { name: 'certificate-bwsddiaa3s3c', path: '/certificates/certificate-bwsddiaa3s3c-1785140297.pdf' },
  { name: 'certificate-gu2huv8wu79r', path: '/certificates/certificate-gu2huv8wu79r-1785045235.pdf' },
  { name: 'certificate-kss3uqvjvr7h', path: '/certificates/certificate-kss3uqvjvr7h-1781894910.pdf' },
  { name: 'certificate-m4aup67k7vr7', path: '/certificates/certificate-m4aup67k7vr7-1785048504.pdf' },
  { name: 'certificate-txdjx8tkhpfb', path: '/certificates/certificate-txdjx8tkhpfb-1784876279.pdf' },
  { name: 'certificate-x7qxsdfhic9h', path: '/certificates/certificate-x7qxsdfhic9h-1785144854.pdf' },
];

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-20 md:py-28 scroll-mt-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-2">
          <FilePdf weight="bold" className="size-5 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Certificates</h2>
        </div>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Certifications and credentials earned.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATES.map(({ name, path }) => (
            <a
              key={name}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <FilePdf weight="bold" className="size-8 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold group-hover:text-primary transition-colors duration-300">
                  {name}
                </h3>
                <span className="text-xs text-muted-foreground">PDF · Click to open</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
