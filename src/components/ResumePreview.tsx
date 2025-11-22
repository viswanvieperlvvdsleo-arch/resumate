
'use client';

import { templates } from '@/lib/templates';
import type { ResumeData } from '@/types/resume';
import React, { useEffect, useRef } from 'react';

interface ResumePreviewProps {
  templateId: string;
  data: ResumeData;
  pageCount: number;
  setPageCount: (count: number) => void;
}

const A4_HEIGHT_PX = 1122.5;

export default function ResumePreview({ templateId, data, pageCount, setPageCount }: ResumePreviewProps) {
  const template = templates.find((t) => t.id === templateId);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const calculatePages = () => {
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        const pages = Math.ceil(contentHeight / A4_HEIGHT_PX);
        setPageCount(pages > 0 ? pages : 1);
      }
    };
    
    // Using a timeout to ensure content has rendered before measuring
    const timeoutId = setTimeout(calculatePages, 200);
    
    // Recalculate with a ResizeObserver to handle dynamic content
    const observer = new ResizeObserver(calculatePages);
    if(contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, [data, templateId, setPageCount]);
  
  if (!template) {
    return <div className="p-8 text-center text-red-500">Template not found.</div>;
  }
  
  const ResumeComponent = template.component;
  
  return (
    <div id="resume-content" className="print:shadow-none print:mx-0">
      <div id="printable-resume-content" className="flex flex-col gap-4">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div key={pageIndex} className="page w-[210mm] h-[297mm] bg-white shadow-lg mx-auto overflow-hidden relative">
            <div
              className="absolute top-0 left-0 w-full"
              style={{ transform: `translateY(-${pageIndex * A4_HEIGHT_PX}px)` }}
            >
              {/* This single instance of the component will be used for height calculation and rendering all pages */}
              {pageIndex === 0 && (
                <div ref={contentRef}>
                  <ResumeComponent data={data} />
                </div>
              )}
              {/* For subsequent pages in the DOM, we just need the same content for printing */}
              {pageIndex > 0 && <ResumeComponent data={data} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
