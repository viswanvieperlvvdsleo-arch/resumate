
'use server';

import { reviewResume, type AIResumeReviewOutput } from '@/ai/flows/ai-resume-review';
import type { ResumeData } from '@/types/resume';

function serializeResumeData(data: ResumeData): string {
    let text = `RESUME\n\n`;
    text += `Name: ${data.fullName}\n`;
    text += `Title: ${data.title}\n\n`;

    text += `--- ABOUT ---\n${data.about}\n\n`;

    text += `--- CONTACT ---\n`;
    text += `Email: ${data.contact.email}\n`;
    text += `Phone: ${data.contact.phone}\n`;
    text += `LinkedIn: ${data.contact.linkedin}\n`;
    text += `GitHub: ${data.contact.github}\n\n`;

    text += `--- SKILLS ---\n${data.skills.map(s => `${s.groupName}: ${s.skills}`).join('\n')}\n\n`;

    text += `--- EDUCATION ---\n`;
    data.education.forEach((edu, index) => {
        text += `education.${index}.degree: ${edu.degree}\n`;
        text += `education.${index}.institution: ${edu.institution}\n`;
        text += `education.${index}.date: ${edu.date}\n\n`;
    });

    if (data.experience && data.experience.length > 0) {
      text += `--- EXPERIENCE ---\n`;
      data.experience.forEach((exp, index) => {
          text += `experience.${index}.company: ${exp.company}\n`;
          text += `experience.${index}.role: ${exp.role}\n`;
          text += `experience.${index}.date: ${exp.date}\n`;
          text += `experience.${index}.description: ${exp.description}\n\n`;
      });
    }
    
    text += `--- PROJECTS ---\n`;
    data.projects.forEach((proj, index) => {
        text += `projects.${index}.title: ${proj.title}\n`;
        text += `projects.${index}.description: ${proj.description}\n`;
        if (proj.link) {
            text += `projects.${index}.link: ${proj.link}\n`;
        }
        text += `\n`;
    });

    if (data.certificates && data.certificates.length > 0) {
      text += `--- CERTIFICATES ---\n`;
      data.certificates.forEach((cert, index) => {
          text += `certificates.${index}.name: ${cert.name}\n`;
          text += `certificates.${index}.issuer: ${cert.issuer}\n`;
          text += `certificates.${index}.date: ${cert.date}\n\n`;
      });
    }

    return text;
}


export async function reviewResumeAction(data: ResumeData): Promise<AIResumeReviewOutput> {
  const resumeText = serializeResumeData(data);
  try {
    const result = await reviewResume({ resumeText });
    return result;
  } catch (error) {
    console.error("AI review failed:", error);
    throw new Error("Failed to get AI suggestions.");
  }
}
