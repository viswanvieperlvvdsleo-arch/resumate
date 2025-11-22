
import type { ResumeData } from '@/types/resume';
import type { FC } from 'react';

const CambridgeTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skillGroups = data.skills?.filter(g => g.groupName && g.skills) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validExperience = data.experience?.filter(e => e.company || e.role) || [];
  const validProjects = data.projects?.filter(p => p.title || p.description) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];

  const baseBodySize = 'var(--resume-body-font-size)';
  const baseHeadingSize = 'var(--resume-heading-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  const getFontSize = (base: string, multiplier: number) => `calc(${base} * ${multiplier})`;

  const LeftColumnSection: FC<{title: string, children: React.ReactNode}> = ({ title, children}) => (
    <section className="mb-4">
      <h2 
        className="font-bold tracking-[0.2em] uppercase text-sm mb-2"
        style={{
            fontFamily: 'var(--resume-heading-font)',
            color: 'var(--primary-color)',
            fontSize: getFontSize(baseBodySize, 1.1)
        }}
       >{title}</h2>
      {children}
    </section>
  );

  const RightColumnSection: FC<{title: string, children: React.ReactNode}> = ({ title, children}) => (
    <section className="mb-6">
      <h2 
        className="font-bold tracking-[0.2em] uppercase text-base mb-2"
        style={{
            fontFamily: 'var(--resume-heading-font)',
            color: 'var(--primary-color)',
            fontSize: getFontSize(baseSubHeadingSize, 0.8)
        }}
      >{title}</h2>
      {children}
    </section>
  );


  return (
    <div 
      className="bg-white h-full p-8"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        color: 'var(--text-color)',
        fontSize: getFontSize(baseBodySize, 1),
      } as React.CSSProperties}
    >
      <header className="text-center mb-2">
        <h1 
          className="font-bold tracking-widest uppercase"
          style={{ 
            fontFamily: 'var(--resume-heading-font)',
            fontSize: getFontSize(baseHeadingSize, 1),
            color: 'var(--primary-color)'
          }}
        >
          {data.fullName}
        </h1>
        <p 
          className="tracking-[0.3em] uppercase"
          style={{
            fontSize: getFontSize(baseBodySize, 0.9),
          }}
        >
          {data.title}
        </p>
      </header>
      
      <div className="text-center border-y border-gray-300 py-1.5 px-8 text-xs grid grid-cols-3 gap-2" style={{fontSize: getFontSize(baseBodySize, 0.9)}}>
        <p>{data.contact.phone}</p>
        <p>{data.contact.email}</p>
        <p>{data.address}</p>
      </div>

      <div className="flex pt-6">
        {/* Left Column */}
        <div className="w-[40%] pr-4 border-r border-gray-300">
           {validEducation.length > 0 && (
            <LeftColumnSection title="Education">
              <div className="space-y-3">
                {validEducation.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-sm">{edu.institution}</h3>
                    <p className="text-xs">{edu.degree}</p>
                    <p className="text-xs italic text-gray-600">{edu.date}</p>
                  </div>
                ))}
              </div>
            </LeftColumnSection>
          )}
          
          {skillGroups.map((group) => (
            <LeftColumnSection key={group.id} title={group.groupName}>
              <ul className="list-disc list-inside space-y-1 text-xs pl-2">
                {group.skills.split(',').map((skill, index) => (
                  <li key={index}>{skill.trim()}</li>
                ))}
              </ul>
            </LeftColumnSection>
          ))}

          {validCertificates.length > 0 && (
            <LeftColumnSection title="Certificates">
              <div className="space-y-3">
                {validCertificates.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-sm">{cert.name}</h3>
                    <p className="text-xs">{cert.issuer}</p>
                    <p className="text-xs italic text-gray-600">{cert.date}</p>
                  </div>
                ))}
              </div>
            </LeftColumnSection>
          )}
        </div>
        
        {/* Right Column */}
        <main className="w-[60%] pl-6">
          {data.about && (
            <section className="mb-6">
              <p className="leading-relaxed text-sm">{data.about}</p>
            </section>
          )}

          {validExperience.length > 0 && (
            <RightColumnSection title="Work Experience">
              <div className="space-y-4">
                {validExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold">{exp.role} | {exp.company}</h3>
                        <p className="text-xs italic text-gray-600 shrink-0 ml-2">{exp.date}</p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-4 mt-1">
                      {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </RightColumnSection>
          )}

          {validProjects.length > 0 && (
            <RightColumnSection title="Projects">
              <div className="space-y-4">
                {validProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold">{proj.title}</h3>
                        {proj.link && <p className="text-xs italic text-gray-600 shrink-0 ml-2">{proj.link}</p>}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-4 mt-1">
                      {proj.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </RightColumnSection>
          )}

          {validCustomSections.map((section) => (
            <RightColumnSection key={section.id} title={section.title}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold">{section.subtitle}</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs pl-4 mt-1">
                    {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                  </ul>
                </div>
              </div>
            </RightColumnSection>
          ))}
        </main>
      </div>
    </div>
  );
};

export default CambridgeTemplate;
