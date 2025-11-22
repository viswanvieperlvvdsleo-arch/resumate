
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { templates } from '@/lib/templates';
import type { Template } from '@/lib/templates';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import type { ResumeData } from '@/types/resume';
import { Input } from '@/components/ui/input';

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

export default function TemplateGalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="font-headline text-2xl font-bold text-primary">
            ResuMate
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">Choose Your Template</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Select a template that best fits your style and industry. Hover to see the effect, click preview to see more.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg text-center"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => {
            const Thumbnail = template.thumbnail;
            return (
              <Card
                key={template.id}
                className="group flex flex-col overflow-hidden relative glow-border transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-0 flex flex-col flex-1">
                  <div className="aspect-[1/1.414] overflow-hidden bg-muted/30">
                    <div className="transform scale-[0.2] origin-top-left">
                       <div className="w-[210mm] h-[297mm] bg-white">
                         <Thumbnail data={sampleData} />
                       </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" asChild>
                      <Link href={`/templates/${template.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Link>
                    </Button>
                  </div>
                  <div className="p-4 border-t mt-auto">
                    <h3 className="font-headline text-lg text-center">{template.name}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
