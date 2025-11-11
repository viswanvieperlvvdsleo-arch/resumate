
import type { ResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Github, Globe, MapPin } from 'lucide-react';
import type { FC } from 'react';

const ModernTemplate2: FC<{ data: ResumeData }> = ({ data }) => {
  const skills = data.skills?.filter(g => g.groupName && g.skills) || [];
  
  const validExperience = data.experience?.filter(p => p.company || p.role || p.description) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];
  
  const baseBodySize = 'var(--resume-body-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  const getFontSize = (base: string, multiplier: number) => `calc(${base} * ${multiplier})`;

  return (
    <div 
      className="bg-white font-sans h-full text-gray-700"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        fontSize: baseBodySize,
        '--header-bg': '#1a237e', // A dark blue close to the image
        '--header-text': '#ffffff',
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="p-8 flex justify-between items-start" style={{backgroundColor: 'var(--header-bg)', color: 'var(--header-text)'}}>
        <div>
          <h1 
            className="text-4xl font-bold"
            style={{ 
              fontFamily: 'var(--resume-heading-font)',
              fontSize: `var(--resume-heading-font-size)`,
            }}
          >
            {data.fullName || 'Your Name'}
          </h1>
          <p className="text-xl mt-1 opacity-90" style={{ fontSize: baseSubHeadingSize }}>{data.title || 'Your Title/Role'}</p>
        </div>
        <div className="text-right text-sm space-y-2" style={{fontSize: getFontSize(baseBodySize, 0.9)}}>
          {data.contact.phone && <div className="flex items-center justify-end gap-2"><Phone className="w-4 h-4" /><span>{data.contact.phone}</span></div>}
          {data.contact.email && <div className="flex items-center justify-end gap-2"><Mail className="w-4 h-4" /><span>{data.contact.email}</span></div>}
          {data.address && <div className="flex items-center justify-end gap-2"><MapPin className="w-4 h-4" /><span>{data.address}</span></div>}
          {data.contact.github && <div className="flex items-center justify-end gap-2"><Globe className="w-4 h-4" /><span>{data.contact.github}</span></div>}
        </div>
      </header>
      
      <main className="p-8" style={{ color: 'var(--text-color)' }}>
        <section className="mb-6">
          <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>ABOUT ME</h2>
          <p className="text-sm leading-relaxed">{data.about || 'A brief summary about your professional background, skills, and career goals.'}</p>
        </section>

        {skills.length > 0 && (
            <section className="mb-6">
                <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>SKILLS</h2>
                <div className="space-y-2">
                    {skills.map((skillGroup, index) => (
                        <div key={index} className="flex items-center text-sm">
                            <div className="bg-gray-700 text-white font-semibold px-3 py-1 mr-4">{skillGroup.groupName}</div>
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.skills.split(',').map(s => s.trim()).filter(Boolean).map((tag, i) => (
                                    <span key={i} className="border border-gray-300 px-3 py-0.5">{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <section className="mb-6">
          <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Work Experience</h2>
          <div className="space-y-4">
            {validExperience.map((exp, index) => (
              <div key={exp.id || index}>
                <h3 className="font-bold text-md" style={{fontFamily: 'var(--resume-heading-font)', fontSize: getFontSize(baseSubHeadingSize, 0.9)}}>{exp.company}</h3>
                <p className="italic text-sm">{exp.role}</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Education</h2>
          <div className="space-y-2">
            {validEducation.map((edu, index) => (
              <div key={edu.id || index}>
                <h3 className="font-bold text-md" style={{fontFamily: 'var(--resume-heading-font)', fontSize: getFontSize(baseSubHeadingSize, 0.9)}}>{edu.degree}</h3>
                <p className="text-sm">{edu.institution} - {edu.date}</p>
              </div>
            ))}
          </div>
        </section>

        {validCertificates.length > 0 && (
          <section>
            <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Certificates</h2>
            <div className="space-y-2">
              {validCertificates.map((cert, index) => (
                <div key={cert.id || index}>
                  <h3 className="font-bold text-md" style={{fontFamily: 'var(--resume-heading-font)', fontSize: getFontSize(baseSubHeadingSize, 0.9)}}>{cert.name}</h3>
                  <p className="text-sm">{cert.issuer} - {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {validCustomSections.map((section) => (
          <section key={section.id} className="mb-6">
            <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>{section.title}</h2>
            <div>
              <h3 className="font-bold text-md" style={{fontFamily: 'var(--resume-heading-font)', fontSize: getFontSize(baseSubHeadingSize, 0.9)}}>{section.subtitle}</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
              </ul>
            </div>
          </section>
        ))}

      </main>
    </div>
  );
};

export default ModernTemplate2;
