

export interface ResumeData {
  fullName: string;
  title: string;
  about: string;
  skills: SkillGroup[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certificates?: Certificate[];
  customSections?: CustomSection[];
  contact: Contact;
  profilePicture?: string; // Data URL for the image
  address?: string;
  references?: Reference[];
}

export interface SkillGroup {
  id: string;
  groupName: string;
  skills: string; // comma-separated list of skills
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  date: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  date: string;
  description: string;
}

export interface Project {
  id:string;
  title: string;
  description: string;
  link: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
}

export interface Reference {
    id: string;
    name: string;
    details: string;
}
