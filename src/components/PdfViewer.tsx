import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowSquareOut, Download } from '@phosphor-icons/react';

interface PdfViewerProps {
  src: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showDownload?: boolean;
}

export function PdfViewer({ src, title, open, onOpenChange, showDownload = true }: PdfViewerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title;
    link.target = '_blank';
    link.rel = 'noopener,noreferrer';
    link.click();
  };

  const handleOpenExternal = () => {
    window.open(src, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[80vh] p-0 gap-0"
        showCloseButton={true}
      >
        <DialogHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleOpenExternal}
              title="Open in new tab"
            >
              <ArrowSquareOut weight="bold" className="size-4" />
              <span className="sr-only">Open in new tab</span>
            </Button>
            {showDownload && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDownload}
                title="Download PDF"
              >
                <Download weight="bold" className="size-4" />
                <span className="sr-only">Download</span>
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <object
            data={src}
            type="application/pdf"
            className="w-full h-full"
            aria-label={title}
          >
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground text-sm">
              <p>PDF cannot be displayed. <a href={src} target="_blank" rel="noopener noreferrer" className="underline">Open in new tab</a></p>
            </div>
          </object>
        </div>
      </DialogContent>
    </Dialog>
  );
}
