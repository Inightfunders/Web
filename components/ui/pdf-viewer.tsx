'use client';

import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  src: string;
}

export const PdfViewer: React.FC<Props> = ({ className = '', src }) => {
  return (
    <Worker workerUrl="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs">
      <div className={cn('pdf-viewer', className)}>
        <Viewer fileUrl={src} />
      </div>
    </Worker>
  );
};
