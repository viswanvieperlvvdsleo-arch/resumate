
import type { ResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import type { FC } from 'react';

const ModernTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skills = data.skills?.flatMap(group => group.skills.split(',').map(s => s.trim())).filter(s => s) || [];
  const validProjects = data.projects?.filter(p => p.title || p.description) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validExperience = data.experience?.filter(e => e.company || e.role) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];

  const baseBodySize = 'var(--resume-body-font-size)';
  const baseHeadingSize = 'var(--resume-heading-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  return (
    <div 
      className="flex bg-white font-sans h-full"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        fontSize: baseBodySize
      } as React.CSSProperties}
    >
      <aside className="w-1/3 bg-gray-100 p-8">
        <header className="text-center mb-10">
          <h1 
            className="font-bold" 
            style={{ 
              color: 'var(--primary-color)',
              fontFamily: 'var(--resume-heading-font)',
              fontSize: `calc(${baseHeadingSize} * 0.9)`
            }}
          >
            {data.fullName || 'Your Name'}
          </h1>
          <p className="mt-1" style={{ color: 'var(--primary-color)', opacity: 0.9, fontSize: `calc(${baseBodySize} * 1.2)` }}>{data.title || 'Your Title/Role'}</p>
        </header>
        
        <section className="mb-8">
          <h2 className="font-semibold border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>Contact</h2>
          <div className="space-y-3" style={{ color: 'var(--text-color)', fontSize: `calc(${baseBodySize} * 0.95)` }}>
            {data.contact.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-3 shrink-0" style={{ color: 'var(--primary-color)' }} /><span>{data.contact.email}</span></div>}
            {data.contact.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-3 shrink-0" style={{ color: 'var(--primary-color)' }} /><span>{data.contact.phone}</span></div>}
            {data.contact.linkedin && <div className="flex items-center"><Linkedin className="w-4 h-4 mr-3 shrink-0" style={{ color: 'var(--primary-color)' }} /><span>{data.contact.linkedin}</span></div>}
            {data.contact.github && <div className="flex items-center"><Github className="w-4 h-4 mr-3 shrink-0" style={{ color: 'var(--primary-color)' }} /><span>{data.contact.github}</span></div>}
          </div>
        </section>

        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="font-semibold border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>Skills</h2>
            <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--text-color)' }}>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>
        )}
        
        {validEducation.length > 0 && (
          <section>
            <h2 className="font-semibold border-b-2 pb-1 mb-3" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>Education</h2>
            <div className="space-y-4" style={{ color: 'var(--text-color)' }}>
              {validEducation.map((edu, index) => (
                  <div key={edu.id || index}>
                    <h3 className="font-bold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseBodySize} * 1.1)` }}>{edu.institution}</h3>
                    <p>{edu.degree}</p>
                    <p className="opacity-80">{edu.date}</p>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </aside>
      
      <main className="w-2/3 p-8" style={{ color: 'var(--text-color)' }}>
        <section className="mb-8">
          <h2 className="font-bold pb-2 mb-4 border-b-2" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>About Me</h2>
          <p className="leading-relaxed">{data.about || 'A brief summary about yourself.'}</p>
        </section>
        
        {validExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bold pb-2 mb-4 border-b-2" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Experience</h2>
            <div className="space-y-5">
                {validExperience.map((exp, index) => (
                    <div key={exp.id || index}>
                        <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>{exp.role} at {exp.company}</h3>
                        <p className="text-sm italic my-1">{exp.date}</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
          </section>
        )}


        {validProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="font-bold pb-2 mb-4 border-b-2" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Projects</h2>
            <div className="space-y-5">
              {validProjects.map((project, index) => (
                  <div key={project.id || index}>
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>{project.title}</h3>
                    <p className="mt-1 leading-relaxed">{project.description}</p>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline" style={{ color: 'var(--primary-color)', fontSize: `calc(${baseBodySize} * 0.9)` }}>{project.link}</a>}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {validCertificates.length > 0 && (
          <section>
            <h2 className="font-bold pb-2 mb-4 border-b-2" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Certificates</h2>
            <div className="space-y-4">
              {validCertificates.map((cert, index) => (
                  <div key={cert.id || index}>
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>{cert.name}</h3>
                    <p className="text-sm italic my-1">{cert.issuer} - {cert.date}</p>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {validCustomSections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="font-bold pb-2 mb-4 border-b-2" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>{section.title}</h2>
            <div className="space-y-5">
              <div>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.9)` }}>{section.subtitle}</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm mt-1">
                      {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                  </ul>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default ModernTemplate;
