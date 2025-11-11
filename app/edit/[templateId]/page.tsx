

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useResumeData } from '@/hooks/use-resume-data';
import EditorForm from '@/components/EditorForm';
import ResumePreview from '@/components/ResumePreview';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Loader2, ZoomIn, ZoomOut, RotateCw, Edit, FileText, ChevronLeft, Wand, Undo2, Palette, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useState, useEffect, useRef, useCallback } from 'react';
import { reviewResumeAction } from './actions';
import type { AISuggestion } from '@/ai/flows/ai-resume-review';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from '@/hooks/use-mobile';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { get, set } from 'lodash';
import { ThemeToggle } from '@/components/theme-toggle';
import { useResumeStyles } from '@/hooks/use-resume-styles';
import { cn } from '@/lib/utils';

type AppliedSuggestion = {
    field: string;
    originalValue: any;
    suggestionValue: string;
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = String(params.templateId);
  const { resumeData, setResumeData } = useResumeData();
  const [isReviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [reviewSuggestions, setReviewSuggestions] = useState<AISuggestion[]>([]);
  const [isReviewLoading, setReviewLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('editor');
  const [appliedSuggestions, setAppliedSuggestions] = useState<AppliedSuggestion[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const { styles } = useResumeStyles();

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  
  const isPanning = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  // Back button handling
  useEffect(() => {
    if (!isMobile) return;

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state || {};
      if (state.sheet === 'review') {
        setReviewSheetOpen(false);
      } else if (state.tab === 'editor') {
        setActiveTab('editor');
      } else {
        // Fallback for any other state or if state is null/undefined
        setActiveTab('editor');
        setReviewSheetOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set the initial state for the editor tab
    window.history.replaceState({ tab: 'editor' }, '');

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isMobile]);

  const handleTabChange = (newTab: string) => {
    if (isMobile && newTab !== activeTab) {
      if (newTab === 'preview') {
        // When moving to preview, we push a state so the back button can return to editor
        window.history.pushState({ tab: newTab }, '');
      } else if (newTab === 'editor') {
        // If we're manually going back to editor, use history.back() to pop the state
        if (window.history.state?.tab === 'preview') {
            window.history.back();
        }
      }
    }
    setActiveTab(newTab);
  };
  
  const handleOpenReviewSheet = () => {
    if (isMobile) {
      window.history.pushState({ sheet: 'review' }, '');
    }
    setReviewSheetOpen(true);
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen && isMobile && window.history.state?.sheet === 'review') {
        // If sheet is closed via UI (e.g., 'x' button or overlay click), go back
        window.history.back();
    }
    setReviewSheetOpen(isOpen);
  }

  const calculateZoom = useCallback(() => {
    if (!previewContainerRef.current || !resumeContainerRef.current) return 1;
    
    const firstPage = resumeContainerRef.current.querySelector(':first-child') as HTMLElement;
    if (!firstPage) return 1;

    const previewRect = previewContainerRef.current.getBoundingClientRect();
    const resumeWidth = firstPage.offsetWidth; 
    const resumeHeight = firstPage.offsetHeight;

    const widthScale = (previewRect.width - 64) / resumeWidth; // 64 for padding
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
  }, [setInitialZoom]);

  useEffect(() => {
    document.documentElement.style.setProperty('--resume-primary-color', styles.primaryColor);
    document.documentElement.style.setProperty('--resume-text-color', styles.textColor);
    document.documentElement.style.setProperty('--resume-heading-font', styles.headingFont === 'default' ? '' : styles.headingFont);
    document.documentElement.style.setProperty('--resume-body-font', styles.bodyFont === 'default' ? '' : styles.bodyFont);
    document.documentElement.style.setProperty('--resume-heading-font-size', `${styles.headingFontSize}px`);
    document.documentElement.style.setProperty('--resume-subheading-font-size', `${styles.subheadingFontSize}px`);
    document.documentElement.style.setProperty('--resume-body-font-size', `${styles.bodyFontSize}px`);
  }, [styles]);


  const handleDownloadPdf = async () => {
    const printableContent = document.getElementById('printable-resume-content');
    if (!printableContent) return;
  
    setIsDownloading(true);
  
    try {
      const resumeContainer = document.getElementById('resume-container');
      const originalTransform = resumeContainer?.style.transform;
      if (resumeContainer) resumeContainer.style.transform = 'scale(1)';
  
      await new Promise((resolve) => setTimeout(resolve, 300));
  
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const canvas = await html2canvas(printableContent, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: printableContent.scrollWidth,
        windowHeight: printableContent.scrollHeight
      });
  
      const imgData = canvas.toDataURL('image/jpeg', 0.95); 
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      if (resumeContainer) resumeContainer.style.transform = originalTransform || '';
  
      pdf.save('ResuMate_Resume.pdf');
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "An unexpected error occurred while generating the PDF.",
        });
    } finally {
        setIsDownloading(false);
    }
  };


  const handleAiReview = async () => {
    setReviewLoading(true);
    handleOpenReviewSheet();
    setAppliedSuggestions([]);
    try {
      const result = await reviewResumeAction(resumeData);
      if (result.suggestions) {
        setReviewSuggestions(result.suggestions);
      } else {
        throw new Error('No suggestions returned from AI.');
      }
    } catch (error) {
      console.error(error);
      if (isMobile && window.history.state?.sheet === 'review') window.history.back();
      setReviewSheetOpen(false);
      toast({
        variant: 'destructive',
        title: 'AI Review Failed',
        description: 'Could not get suggestions. Please try again later.',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    const originalValue = get(resumeData, suggestion.field);
    const newData = { ...resumeData };
    set(newData, suggestion.field, suggestion.suggestion);
    setResumeData(newData);
    setAppliedSuggestions(prev => [...prev, {
        field: suggestion.field,
        originalValue,
        suggestionValue: suggestion.suggestion,
    }]);
    toast({
      title: 'Suggestion Applied',
      description: `Updated the '${suggestion.field}' field.`,
    });
  };

  const handleUndoSuggestion = (applied: AppliedSuggestion) => {
    const newData = { ...resumeData };
    set(newData, applied.field, applied.originalValue);
    setResumeData(newData);
    setAppliedSuggestions(prev => prev.filter(s => s.field !== applied.field));
    toast({
      title: 'Suggestion Undone',
      description: `Reverted the '${applied.field}' field.`,
    });
  };

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
    const x = startX.current - clientX;
    const y = startY.current - clientY;
    previewContainerRef.current.scrollLeft = scrollLeft.current + x;
    previewContainerRef.current.scrollTop = scrollTop.current + y;
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
  }, [activeTab]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.1, 1.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.1, 0.4));
  const handleZoomReset = () => setInitialZoom();
  
  const editorPanel = (
    <div className="h-full overflow-y-auto no-print">
        <EditorForm resumeData={resumeData} setResumeData={setResumeData} />
    </div>
  );

  const previewPanel = (
     <div className="flex flex-col h-full bg-muted/40 print:hidden">
        <div 
            ref={previewContainerRef} 
            className="flex-1 p-4 md:p-8 overflow-auto cursor-grab"
            onMouseDown={handlePanStart}
            onTouchStart={handlePanStart}
        >
            <div className="no-print flex justify-center items-center gap-2 mb-4 sticky top-0 z-10 bg-muted/40 py-2">
              <Button variant="outline" size="icon" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={handleZoomReset}><RotateCw className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
            </div>
            <div className="flex-1 flex items-start justify-center pointer-events-none">
              <div ref={resumeContainerRef} id="resume-container" className="pointer-events-auto my-auto" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                <ResumePreview templateId={templateId} data={resumeData} pageCount={pageCount} setPageCount={setPageCount} />
              </div>
            </div>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center gap-2 p-4 bg-muted/60 border-t">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentPage(i)}
              className={cn(
                "w-12 h-16 border-2 bg-white rounded flex items-center justify-center text-sm text-muted-foreground",
                i === currentPage ? "border-primary" : "border-gray-300"
              )}
            >
              Page {i + 1}
            </button>
          ))}
           <button 
              className="w-12 h-16 border border-dashed border-gray-400 bg-gray-50 rounded flex items-center justify-center text-muted-foreground hover:bg-gray-100"
              onClick={() => toast({ title: "Coming soon!", description: "Adding pages manually is on our roadmap."})}
           >
              <FilePlus2 className="h-6 w-6"/>
            </button>
        </div>
      </div>
  );


  if (!templateId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4">Loading template...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-wrap items-center justify-between p-2 border-b bg-card shadow-sm no-print gap-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push('/templates')}>
            <ChevronLeft />
          </Button>
          <Link href="/" className="font-headline text-2xl font-bold text-primary hidden sm:block">
            ResuMate
          </Link>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={handleAiReview} disabled={isReviewLoading}>
            {isReviewLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            AI Review
          </Button>
          <Button id="download-pdf-button" onClick={handleDownloadPdf} className="glow-border" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
          <Button asChild variant="outline">
            <Link href={`/edit/${templateId}/styling`}>
              <Palette className="mr-2 h-4 w-4" />
              Styling
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {isMobile ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1">
          <TabsContent value="editor" className="flex-1 overflow-y-auto mt-0">
             {editorPanel}
          </TabsContent>
          <TabsContent value="preview" className="flex-1 mt-0">
             {previewPanel}
          </TabsContent>
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-none mt-auto no-print">
            <TabsTrigger value="editor" className="h-full rounded-none text-base">
                <Edit className="mr-2" /> Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-full rounded-none text-base">
                <FileText className="mr-2" /> Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : (
        <div className="flex-1 grid md:grid-cols-2 overflow-hidden h-full">
            <div className="h-full overflow-y-auto">{editorPanel}</div>
            <div className="h-full overflow-y-auto">{previewPanel}</div>
        </div>
      )}
      
      <Sheet open={isReviewSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl flex items-center"><Sparkles className="mr-2 text-accent"/>AI Resume Review</SheetTitle>
            <SheetDescription>
              Here are some suggestions to improve your resume. Click apply to update your resume.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-1 -mr-4 pr-4">
            {isReviewLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {reviewSuggestions.map((suggestion, index) => {
                  const applied = appliedSuggestions.find(s => s.field === suggestion.field);
                  const originalValue = applied ? applied.originalValue : get(resumeData, suggestion.field);
                  return (
                    <div key={index} className="p-4 rounded-lg bg-muted/50 border">
                        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                          <span className="font-semibold block mb-1">Suggested change:</span>
                          <span className="font-mono text-xs bg-green-100 text-green-900 rounded p-1 dark:bg-green-900/50 dark:text-green-200">
                            {suggestion.suggestion}
                          </span>
                           {originalValue && (
                             <>
                              <span className="font-semibold block mt-2 mb-1">Original:</span>
                              <span className="font-mono text-xs bg-red-100 text-red-900 rounded p-1 dark:bg-red-900/50 dark:text-red-200 line-through">
                                {String(originalValue)}
                              </span>
                            </>
                           )}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
                            <code className="text-xs text-muted-foreground bg-black/5 px-2 py-1 rounded">{suggestion.field}</code>
                            {applied ? (
                                <button className='flex items-center text-sm p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80' onClick={() => handleUndoSuggestion(applied)}>
                                   <Undo2 className="mr-2 h-4 w-4" />
                                   Undo
                                </button>
                            ) : (
                                <button className='flex items-center text-sm p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20' onClick={() => handleApplySuggestion(suggestion)}>
                                   <Wand className="mr-2 h-4 w-4" />
                                   Apply
                                </button>
                            )}
                        </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
