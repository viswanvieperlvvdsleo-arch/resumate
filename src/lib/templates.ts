
import type { ResumeData } from '@/types/resume';
import type { FC } from 'react';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalistTemplate from '@/components/templates/MinimalistTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ModernTemplate2 from '@/components/templates/ModernTemplate2';
import TimelineTemplate from '@/components/templates/TimelineTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import CambridgeTemplate from '@/components/templates/CambridgeTemplate';

export interface Template {
  id: string;
  name: string;
  component: FC<{ data: ResumeData }>;
  thumbnail: FC<{ data: ResumeData }>;
}

export const templates: Template[] = [
  { id: 'cambridge', name: 'Cambridge', component: CambridgeTemplate, thumbnail: CambridgeTemplate },
  { id: 'executive', name: 'Executive', component: ExecutiveTemplate, thumbnail: ExecutiveTemplate },
  { id: 'timeline', name: 'Timeline', component: TimelineTemplate, thumbnail: TimelineTemplate },
  { id: 'creative', name: 'Creative', component: CreativeTemplate, thumbnail: CreativeTemplate },
  { id: 'professional', name: 'Professional', component: ProfessionalTemplate, thumbnail: ProfessionalTemplate },
  { id: 'minimalist-clean', name: 'Minimalist', component: MinimalistTemplate, thumbnail: MinimalistTemplate },
  { id: 'modern-sleek', name: 'Modern Sleek', component: ModernTemplate2, thumbnail: ModernTemplate2 },
  { id: 'classic-professional', name: 'Classic Professional', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'modern-creative', name: 'Modern Creative', component: ModernTemplate, thumbnail: ModernTemplate },
  { id: 'classic-minimalist', name: 'Classic Minimalist', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'modern-tech', name: 'Modern Tech', component: ModernTemplate, thumbnail: ModernTemplate },
  { id: 'classic-academic', name: 'Classic Academic', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'modern-bold', name: 'Modern Bold', component: ModernTemplate, thumbnail: ModernTemplate },
  { id: 'classic-elegant', name: 'Classic Elegant', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'classic-standard', name: 'Classic Standard', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'modern-vibrant', name: 'Modern Vibrant', component: ModernTemplate, thumbnail: ModernTemplate },
  { id: 'classic-corporate', name: 'Classic Corporate', component: ClassicTemplate, thumbnail: ClassicTemplate },
  { id: 'modern-designer', name: 'Modern Designer', component: ModernTemplate, thumbnail: ModernTemplate },
];
