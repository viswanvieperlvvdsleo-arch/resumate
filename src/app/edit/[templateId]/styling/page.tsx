
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useResumeStyles } from '@/hooks/use-resume-styles';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const fontOptions = [
    { name: 'Default', value: 'default' },
    { name: 'Alegreya', value: "'Alegreya', serif" },
    { name: 'Belleza', value: "'Belleza', sans-serif" },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Georgia', value: "'Georgia', serif" },
    { name: 'Times New Roman', value: "'Times New Roman', Times, serif" },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
];

export default function StylingPage() {
    const params = useParams();
    const templateId = String(params.templateId);
    const { styles, setStyles, resetStyles, defaultStyles } = useResumeStyles();
    const { toast } = useToast();

    useEffect(() => {
        document.documentElement.style.setProperty('--resume-primary-color', styles.primaryColor);
        document.documentElement.style.setProperty('--resume-text-color', styles.textColor);
        document.documentElement.style.setProperty('--resume-heading-font', styles.headingFont === 'default' ? '' : styles.headingFont);
        document.documentElement.style.setProperty('--resume-body-font', styles.bodyFont === 'default' ? '' : styles.bodyFont);
        document.documentElement.style.setProperty('--resume-heading-font-size', `${styles.headingFontSize}px`);
        document.documentElement.style.setProperty('--resume-subheading-font-size', `${styles.subheadingFontSize}px`);
        document.documentElement.style.setProperty('--resume-body-font-size', `${styles.bodyFontSize}px`);
    }, [styles]);

    const handleResetStyles = () => {
        resetStyles();
        toast({
            title: 'Styling Reset',
            description: 'All style customizations have been reset to their default values.'
        });
    };

    const createStyleUpdater = <K extends keyof typeof styles>(key: K) => {
        return (value: (typeof styles)[K]) => {
            setStyles(prev => ({...prev, [key]: value}));
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between p-2 border-b bg-card shadow-sm">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/edit/${templateId}`}>
                            <ChevronLeft />
                        </Link>
                    </Button>
                    <h1 className="font-headline text-2xl font-bold text-primary">
                        Resume Styling
                    </h1>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-md mx-auto space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="relative">
                            <input
                                type="color"
                                value={styles.primaryColor}
                                onChange={(e) => createStyleUpdater('primaryColor')(e.target.value)}
                                className="p-1 h-10 w-full border border-input rounded-md cursor-pointer"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm uppercase text-muted-foreground">{styles.primaryColor}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="relative">
                            <input
                                type="color"
                                value={styles.textColor}
                                onChange={(e) => createStyleUpdater('textColor')(e.target.value)}
                                className="p-1 h-10 w-full border border-input rounded-md cursor-pointer"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm uppercase text-muted-foreground">{styles.textColor}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Heading Font</Label>
                        <Select value={styles.headingFont} onValueChange={createStyleUpdater('headingFont')}>
                            <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                            <SelectContent>
                                {fontOptions.map(font => <SelectItem key={font.name} value={font.value}>{font.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Body Font</Label>
                        <Select value={styles.bodyFont} onValueChange={createStyleUpdater('bodyFont')}>
                            <SelectTrigger><SelectValue placeholder="Select a font" /></SelectTrigger>
                            <SelectContent>
                                {fontOptions.map(font => <SelectItem key={font.name} value={font.value}>{font.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-4">
                        <Label>Heading Font Size <span className="text-muted-foreground">({styles.headingFontSize}px)</span></Label>
                        <Slider
                            value={[styles.headingFontSize]}
                            onValueChange={([v]) => createStyleUpdater('headingFontSize')(v)}
                            max={60} min={24} step={1}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Subheading Font Size <span className="text-muted-foreground">({styles.subheadingFontSize}px)</span></Label>
                        <Slider
                            value={[styles.subheadingFontSize]}
                            onValueChange={([v]) => createStyleUpdater('subheadingFontSize')(v)}
                            max={32} min={14} step={1}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label>Body Font Size <span className="text-muted-foreground">({styles.bodyFontSize}px)</span></Label>
                        <Slider
                            value={[styles.bodyFontSize]}
                            onValueChange={([v]) => createStyleUpdater('bodyFontSize')(v)}
                            max={16} min={9} step={0.5}
                        />
                    </div>
                </div>
            </main>
            <footer className="p-4 border-t">
                <div className="max-w-md mx-auto">
                    <Button variant="outline" className="w-full" onClick={handleResetStyles}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reset Styles
                    </Button>
                </div>
            </footer>
        </div>
    );
}

    