
import type { ResumeData } from '@/types/resume';
import type { FC } from 'react';

const MinimalistTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skills = data.skills?.map(g => g.skills).join(', ') || '';
  const validExperience = data.experience?.filter(p => p.company || p.role || p.description) || [];
  const validProjects = data.projects?.filter(p => p.title || p.description) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];
  
  const baseBodySize = 'var(--resume-body-font-size)';
  const baseHeadingSize = 'var(--resume-heading-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  return (
    <div 
      className="p-10 bg-white"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        color: 'var(--text-color)',
        fontSize: `calc(${baseBodySize} * 1.1)`,
      } as React.CSSProperties}
    >
      <header className="text-center mb-6">
        <h1 
          className="font-bold tracking-wider"
          style={{ 
            fontFamily: 'var(--resume-heading-font)',
            fontSize: `calc(${baseHeadingSize} * 1.2)`,
            color: 'black'
          }}
        >
          {data.fullName || 'Full Name'}
        </h1>
        <p 
          className="mt-2 text-sm"
          style={{ 
            color: 'var(--text-color)', 
            fontSize: baseBodySize
          }}
        >
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span className="mx-2">•</span>}
          {data.contact.phone && <span>{data.contact.phone}</span>}
          {data.contact.github && <span className="mx-2">•</span>}
          {data.contact.github && <span>{data.contact.github}</span>}
        </p>
      </header>

      <hr className="mb-6"/>
      
      <main>
        {validEducation.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>EDUCATION</h2>
              {validEducation.map((edu, index) => (
                <div key={edu.id || index} className="mb-2">
                  <div className="flex justify-between">
                    <p className="font-bold">{edu.institution}</p>
                    <p className="font-bold">{edu.date}</p>
                  </div>
                  <p>{edu.degree}</p>
                </div>
              ))}
            </section>
        )}

        {validExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-4">
              {validExperience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between">
                    <p className="font-bold">{exp.company}</p>
                    <p className="font-bold">{exp.date}</p>
                  </div>
                  <p className="italic">{exp.role}</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {validProjects.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>PROJECTS & EXTRACURRICULAR</h2>
              <div className="space-y-4">
                {validProjects.map((project, index) => (
                  <div key={project.id || index}>
                    <div className="flex justify-between">
                        <h3 className="font-bold">{project.title}</h3>
                        {project.link && <p className="font-bold">{project.link}</p>}
                    </div>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {project.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
        )}

        {validCertificates.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>CERTIFICATES</h2>
              {validCertificates.map((cert, index) => (
                <div key={cert.id || index} className="mb-2">
                  <div className="flex justify-between">
                    <p className="font-bold">{cert.name}</p>
                    <p className="font-bold">{cert.date}</p>
                  </div>
                  <p>{cert.issuer}</p>
                </div>
              ))}
            </section>
        )}

        {validCustomSections.map((section, index) => (
            <section key={section.id || index} className="mb-6">
              <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>{section.title.toUpperCase()}</h2>
              <div className="space-y-4">
                  <div>
                      <div className="flex justify-between">
                          <h3 className="font-bold">{section.subtitle}</h3>
                      </div>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                      </ul>
                  </div>
              </div>
            </section>
        ))}
        
        {skills.length > 0 && (
          <section>
            <h2 className="font-bold tracking-widest text-sm mb-3" style={{ color: 'black', fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.7)` }}>SKILLS</h2>
            <p>{skills}</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default MinimalistTemplate;
