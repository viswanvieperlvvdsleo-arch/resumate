
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-animated p-8 text-center">
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl"></div>
        <h1 className="relative font-headline text-7xl md:text-9xl font-bold text-foreground tracking-tighter">
          ResuMate
        </h1>
      </div>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        The modern, web-based resume builder that helps you create professional resumes instantly — no account required.
      </p>
      <div className="mt-10">
        <Button asChild size="lg" className="group glow-border">
          <Link href="/templates">
            Choose a Template
            <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
