
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { templates } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Check, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ResumeData } from '@/types/resume';

const sampleData: ResumeData = {
  fullName: 'Your Name',
  title: 'Your Professional Title',
  about: 'A passionate and driven professional with a knack for creating elegant solutions. Eager to contribute to a dynamic team and leverage skills in a challenging environment.',
  skills: [
    { id: 'skill1', groupName: 'Core Competencies', skills: 'Skill A, Skill B, Skill C' },
    { id: 'skill2', groupName: 'Tools & Technologies', skills: 'Software X, Platform Y, Tool Z' },
    { id: 'skill3', groupName: 'Languages', skills: 'Language 1, Language 2' },
  ],
  education: [
    { id: 'edu1', institution: 'Your University', degree: 'Your Degree or Major', date: '2018 - 2022' }
  ],
  experience: [
    { id: 'exp1', company: 'Previous Company', role: 'Your Role', date: '2022 - Present', description: '• Achieved key metric by implementing a new strategy.\n• Led a team to successfully complete a major project.' }
  ],
  projects: [
    { id: 'proj1', title: 'Project Name', description: 'A brief description of your project and its impact.', link: 'your-project-link.com' }
  ],
  contact: { 
    email: 'your.email@example.com', 
    phone: '(123) 456-7890', 
    linkedin: 'linkedin.com/in/yourprofile', 
    github: 'github.com/yourusername' 
  },
  certificates: [
    { id: 'cert1', name: 'Name of Certificate', issuer: 'Issuing Organization', date: 'Year' }
  ],
  address: 'Your City, State',
  profilePicture: ``,
  references: [
      { id: 'ref1', name: 'Reference Name, Title', details: 'contact@example.com' }
  ]
};


const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = String(params.templateId);
  const [zoom, setZoom] = useState(1);
  
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const resumeContainerRef = useRef<HTMLDivElement>(null);

  const isPanning = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const template = templates.find(t => t.id === templateId);

  const calculateZoom = useCallback(() => {
    if (!previewContainerRef.current || !resumeContainerRef.current) return 1;

    const previewRect = previewContainerRef.current.getBoundingClientRect();
    const resumeWidth = A4_WIDTH_MM * 3.78; 
    const resumeHeight = A4_HEIGHT_MM * 3.78;

    const widthScale = (previewRect.width - 64) / resumeWidth;
    const heightScale = (previewRect.height - 64) / resumeHeight;

    return Math.min(widthScale, heightScale, 1.5);
  }, []);

  const setInitialZoom = useCallback(() => {
    const initialZoom = calculateZoom();
    setZoom(initialZoom);
  }, [calculateZoom]);

  useEffect(() => {
    setInitialZoom();
    window.addEventListener('resize', setInitialZoom);
    return () => window.removeEventListener('resize', setInitialZoom);
  }, [setInitialZoom, templateId]);

  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!previewContainerRef.current) return;
    isPanning.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startX.current = clientX;
    startY.current = clientY;
    scrollLeft.current = previewContainerRef.current.scrollLeft;
    scrollTop.current = previewContainerRef.current.scrollTop;
    previewContainerRef.current.style.cursor = 'grabbing';
    previewContainerRef.current.style.userSelect = 'none';
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning.current || !previewContainerRef.current) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - startX.current;
    const y = clientY - startY.current;
    previewContainerRef.current.scrollLeft = scrollLeft.current - x;
    previewContainerRef.current.scrollTop = scrollTop.current - y;
  };

  const handlePanEnd = () => {
    if (!previewContainerRef.current) return;
    isPanning.current = false;
    previewContainerRef.current.style.cursor = 'grab';
    previewContainerRef.current.style.removeProperty('user-select');
  };

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent | TouchEvent) => handlePanMove(e as any);
    const handleEnd = () => handlePanEnd();

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);
    container.addEventListener('touchmove', handleMove, { passive: false });
    container.addEventListener('touchend', handleEnd);
    container.addEventListener('touchcancel', handleEnd);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseup', handleEnd);
      container.removeEventListener('mouseleave', handleEnd);
      container.removeEventListener('touchmove', handleMove);
      container.removeEventListener('touchend', handleEnd);
      container.removeEventListener('touchcancel', handleEnd);
    };
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));

  const handleUseTemplate = () => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem('resumeData');
    }
  };

  const handleNextTemplate = () => {
    if (!template) return;
    const currentIndex = templates.findIndex(t => t.id === template.id);
    const nextIndex = (currentIndex + 1) % templates.length;
    router.push(`/templates/${templates[nextIndex].id}`);
  };

  const handlePrevTemplate = () => {
    if (!template) return;
    const currentIndex = templates.findIndex(t => t.id === template.id);
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
    router.push(`/templates/${templates[prevIndex].id}`);
  };

  if (!template) {
    return <div>Template not found</div>;
  }

  const { component: ResumeComponent } = template;


  return (
    <div className="flex flex-col h-screen bg-muted">
      <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-20 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" onClick={() => router.push('/templates')}>
                <ChevronLeft />
             </Button>
             <h1 className="font-headline text-2xl font-bold text-primary">{template.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={setInitialZoom}><RotateCw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
            <div className='ml-4'>
                <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 relative group">
        <main 
            ref={previewContainerRef} 
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-auto cursor-grab"
            onMouseDown={handlePanStart}
            onTouchStart={handlePanStart}
        >
            <div ref={resumeContainerRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }} className="pointer-events-none my-auto">
                <div className="w-[210mm] h-[297mm] bg-white shadow-lg pointer-events-auto">
                    <ResumeComponent data={sampleData} />
                </div>
            </div>
        </main>
        
        <Button
            variant="outline"
            size="icon"
            onClick={handlePrevTemplate}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <ChevronLeft />
        </Button>
        <Button
            variant="outline"
            size="icon"
            onClick={handleNextTemplate}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <ChevronRight />
        </Button>
      </div>


      <footer className="bg-card/80 backdrop-blur-sm sticky bottom-0 z-10 border-t p-4 flex justify-center">
         <Button asChild className='glow-border' size="lg" onClick={handleUseTemplate}>
            <Link href={`/edit/${template.id}`}>
                <Check className="mr-2 h-4 w-4" /> Use Template
            </Link>
         </Button>
      </footer>
    </div>
  );
}

    

    