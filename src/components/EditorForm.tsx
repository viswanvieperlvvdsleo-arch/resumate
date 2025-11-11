
'use client';

import type { ResumeData, Education, Project, Experience, Reference, SkillGroup, Certificate, CustomSection } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Image as ImageIcon, X, Briefcase, Code, Star, Languages, Heart, Award, BrainCircuit, Mic } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import Image from 'next/image';
import { useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface EditorFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

const iconOptions = [
    { name: 'Briefcase', value: 'briefcase', icon: <Briefcase /> },
    { name: 'Code', value: 'code', icon: <Code /> },
    { name: 'Education', value: 'star', icon: <Star /> },
    { name: 'Languages', value: 'languages', icon: <Languages /> },
    { name: 'Interests', value: 'heart', icon: <Heart /> },
    { name: 'Certificates', value: 'award', icon: <Award /> },
    { name: 'Skills', value: 'brain-circuit', icon: <BrainCircuit /> },
    { name: 'Speaking', value: 'mic', icon: <Mic /> },
];

const getIconByName = (name: string) => {
    const icon = iconOptions.find(opt => opt.value === name);
    return icon ? icon.icon : <Briefcase />;
}

export default function EditorForm({ resumeData, setResumeData }: EditorFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: any) => {
    const fieldParts = field.split('.');
    if (fieldParts.length > 1) {
      setResumeData({
        ...resumeData,
        [fieldParts[0]]: {
          ...(resumeData as any)[fieldParts[0]],
          [fieldParts[1]]: value,
        },
      });
    } else {
      setResumeData({ ...resumeData, [field]: value });
    }
  };

  const handleArrayChange = <T extends Education | Project | Experience | Reference | SkillGroup | Certificate | CustomSection>(
    section: keyof ResumeData,
    index: number,
    field: keyof T,
    value: string
  ) => {
    const newArray = [...(resumeData[section] as T[] || [])];
    if (newArray[index]) {
      (newArray[index] as any)[field] = value;
      setResumeData({ ...resumeData, [section]: newArray });
    }
  };

  const addArrayItem = (section: 'education' | 'projects' | 'experience' | 'references' | 'skills' | 'certificates' | 'customSections') => {
    let newItem;
    if (section === 'education') {
        newItem = { id: crypto.randomUUID(), institution: '', degree: '', date: '' };
    } else if (section === 'projects') {
        newItem = { id: crypto.randomUUID(), title: '', description: '', link: '' };
    } else if (section === 'experience') {
        newItem = { id: crypto.randomUUID(), company: '', role: '', date: '', description: '' };
    } else if (section === 'references') {
        newItem = { id: crypto.randomUUID(), name: '', details: '' };
    } else if (section === 'certificates') {
        newItem = { id: crypto.randomUUID(), name: '', issuer: '', date: '' };
    } else if (section === 'customSections') {
        newItem = { id: crypto.randomUUID(), title: '', subtitle: '', description: '', icon: 'briefcase' };
    } else { // skills
        newItem = { id: crypto.randomUUID(), groupName: '', skills: '' };
    }
    
    setResumeData({
      ...resumeData,
      [section]: [...(resumeData[section] as any[] || []), newItem],
    });
  };

  const removeArrayItem = (section: keyof ResumeData, id: string) => {
    setResumeData({
      ...resumeData,
      [section]: (resumeData[section] as any[])?.filter((item) => item.id !== id),
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData({ ...resumeData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 h-full overflow-y-auto">
      <Accordion type="multiple" defaultValue={['personal', 'contact', 'skills', 'education', 'experience', 'projects', 'certificates', 'references', 'customSections']} className="w-full">
        <AccordionItem value="personal">
          <AccordionTrigger className='font-headline text-lg'>Personal Details</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <Label>Profile Picture</Label>
              <div className="mt-2">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                {resumeData.profilePicture ? (
                    <div className="relative w-24 h-24">
                        <Image src={resumeData.profilePicture} alt="Profile" layout="fill" className="rounded-md object-cover" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setResumeData({...resumeData, profilePicture: ''})}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                        <ImageIcon className="h-8 w-8" />
                        <span className="mt-1 text-xs">Your Image</span>
                    </button>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={resumeData.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="title">Title / Role</Label>
              <Input id="title" value={resumeData.title || ''} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="about">Profile / About Me</Label>
              <Textarea id="about" value={resumeData.about || ''} onChange={(e) => handleChange('about', e.target.value)} rows={5} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="contact">
          <AccordionTrigger className='font-headline text-lg'>Contact</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={resumeData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={resumeData.contact.email || ''} onChange={(e) => handleChange('contact.email', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={resumeData.contact.phone || ''} onChange={(e) => handleChange('contact.phone', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" value={resumeData.contact.linkedin || ''} onChange={(e) => handleChange('contact.linkedin', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="github">GitHub / Website</Label>
              <Input id="github" value={resumeData.contact.github || ''} onChange={(e) => handleChange('contact.github', e.target.value)} />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="skills">
          <AccordionTrigger className='font-headline text-lg'>Skills</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Define skill categories and the skills within them. How these are displayed varies by template.</p>
            {resumeData.skills?.map((skillGroup, index) => (
              <div key={skillGroup.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('skills', skillGroup.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                 <div className="space-y-2">
                  <Label>Category (e.g., "Languages", "Frameworks")</Label>
                  <Input value={skillGroup.groupName || ''} onChange={(e) => handleArrayChange('skills', index, 'groupName', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Skills (comma-separated)</Label>
                  <Textarea placeholder="React, TypeScript, Node.js" value={skillGroup.skills || ''} onChange={(e) => handleArrayChange('skills', index, 'skills', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('skills')}><Plus className="mr-2 h-4 w-4" /> Add Skill Group</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience">
          <AccordionTrigger className='font-headline text-lg'>Employment History</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.experience && resumeData.experience.map((exp, index) => (
              <div key={exp.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('experience', exp.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                 <div className="space-y-2">
                  <Label>Company & Location</Label>
                  <Input value={exp.company || ''} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={exp.role || ''} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Date</Label>
                  <Input value={exp.date || ''} onChange={(e) => handleArrayChange('experience', index, 'date', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Description (one point per line)</Label>
                  <Textarea value={exp.description || ''} onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('experience')}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education">
          <AccordionTrigger className='font-headline text-lg'>Education</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('education', edu.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-2">
                  <Label htmlFor={`edu-institution-${index}`}>Institution & Location</Label>
                  <Input id={`edu-institution-${index}`} value={edu.institution || ''} onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-degree-${index}`}>Degree / Certificate</Label>
                  <Input id={`edu-degree-${index}`} value={edu.degree || ''} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-date-${index}`}>Date</Label>
                  <Input id={`edu-date-${index}`} value={edu.date || ''} onChange={(e) => handleArrayChange('education', index, 'date', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('education')}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certificates">
          <AccordionTrigger className='font-headline text-lg'>Certificates</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.certificates && resumeData.certificates.map((cert, index) => (
              <div key={cert.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('certificates', cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-2">
                  <Label htmlFor={`cert-name-${index}`}>Certificate Name</Label>
                  <Input id={`cert-name-${index}`} value={cert.name || ''} onChange={(e) => handleArrayChange('certificates', index, 'name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                  <Input id={`cert-issuer-${index}`} value={cert.issuer || ''} onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cert-date-${index}`}>Date</Label>
                  <Input id={`cert-date-${index}`} value={cert.date || ''} onChange={(e) => handleArrayChange('certificates', index, 'date', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('certificates')}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="projects">
          <AccordionTrigger className='font-headline text-lg'>Projects & Extracurriculars</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.projects.map((proj, index) => (
              <div key={proj.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('projects', proj.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                 <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={proj.title || ''} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Description (one point per line)</Label>
                  <Textarea value={proj.description || ''} onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Date or Link</Label>
                  <Input value={proj.link || ''} onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('projects')}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="customSections">
          <AccordionTrigger className='font-headline text-lg'>Optional Sections</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.customSections?.map((section, index) => (
              <div key={section.id} className="p-4 border rounded-lg space-y-3 relative bg-card">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('customSections', section.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-2">
                  <Label>Icon</Label>
                   <Select value={section.icon || 'briefcase'} onValueChange={(value) => handleArrayChange('customSections', index, 'icon', value)}>
                        <SelectTrigger>
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                   {getIconByName(section.icon)} 
                                   <span>{iconOptions.find(opt => opt.value === section.icon)?.name || 'Select...'}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {iconOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    <div className="flex items-center gap-2">
                                        {opt.icon}
                                        <span>{opt.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input value={section.title || ''} onChange={(e) => handleArrayChange('customSections', index, 'title', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input value={section.subtitle || ''} onChange={(e) => handleArrayChange('customSections', index, 'subtitle', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description (one point per line)</Label>
                  <Textarea value={section.description || ''} onChange={(e) => handleArrayChange('customSections', index, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('customSections')}><Plus className="mr-2 h-4 w-4" /> Add Optional Section</Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="references">
          <AccordionTrigger className='font-headline text-lg'>References</AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            {resumeData.references && resumeData.references.map((ref, index) => (
              <div key={ref.id || index} className="p-4 border rounded-lg space-y-3 relative bg-card">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive z-10" onClick={() => removeArrayItem('references', ref.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                 <div className="space-y-2">
                  <Label>Reference Name</Label>
                  <Input value={ref.name || ''} onChange={(e) => handleArrayChange('references', index, 'name', e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label>Details (Contact Info, Title, etc.)</Label>
                  <Textarea value={ref.details || ''} onChange={(e) => handleArrayChange('references', index, 'details', e.target.value)} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={() => addArrayItem('references')}><Plus className="mr-2 h-4 w-4" /> Add Reference</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
