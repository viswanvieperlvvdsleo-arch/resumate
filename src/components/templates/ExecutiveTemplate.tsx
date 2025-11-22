
import type { ResumeData } from '@/types/resume';
import type { FC } from 'react';

const ExecutiveTemplate: FC<{ data: ResumeData }> = ({ data }) => {
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


  return (
    <div 
      className="bg-white h-full font-serif text-sm"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        color: 'var(--text-color)',
        fontSize: getFontSize(baseBodySize, 0.9),
      } as React.CSSProperties}
    >
      <header className="text-center pt-10 pb-4">
        <h1 
          className="font-bold tracking-widest uppercase"
          style={{ 
            fontFamily: 'var(--resume-heading-font)',
            fontSize: getFontSize(baseHeadingSize, 1.1),
            color: '#2c3e50'
          }}
        >
          {data.fullName}
        </h1>
        <p 
          className="tracking-[0.2em] uppercase"
          style={{
            fontSize: getFontSize(baseBodySize, 0.8),
          }}
        >
          {data.title}
        </p>
      </header>
      
      <div className="text-center border-y border-gray-300 py-1 px-10 text-xs grid grid-cols-3 gap-2" style={{fontSize: getFontSize(baseBodySize, 0.8)}}>
        <p>{data.contact.phone}</p>
        <p>{data.contact.email}</p>
        <p>{data.address}</p>
      </div>

      <div className="flex pt-6 px-10">
        <aside className="w-[35%] pr-6 border-r border-gray-300">
           {validEducation.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>Education</h2>
              <div className="space-y-4">
                {validEducation.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-xs">{edu.institution}</h3>
                    <p className="text-xs">{edu.degree}</p>
                    <p className="text-xs">{edu.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {skillGroups.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>Skills</h2>
              {skillGroups.map((group) => (
                <div key={group.id} className="mb-4">
                  <h3 className="font-semibold text-xs tracking-[0.1em] uppercase mb-2" style={{color: '#2c3e50'}}>{group.groupName}</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs pl-2">
                    {group.skills.split(',').map((skill, index) => (
                      <li key={index}>{skill.trim()}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {validCertificates.length > 0 && (
            <section className="mb-6">
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>Certificates</h2>
              <div className="space-y-4">
                {validCertificates.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-xs">{cert.name}</h3>
                    <p className="text-xs">{cert.issuer}</p>
                    <p className="text-xs">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </aside>
        <main className="w-[65%] pl-6">
          {data.about && (
            <section className="mb-6">
              <p className="leading-relaxed text-xs">{data.about}</p>
            </section>
          )}

          {validExperience.length > 0 && (
            <section className='mb-6'>
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>Work Experience</h2>
              <div className="space-y-5">
                {validExperience.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="text-xs font-bold">{exp.role} | {exp.company}</h3>
                    <p className="text-xs italic mb-1">{exp.date}</p>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-4">
                      {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {validProjects.length > 0 && (
            <section>
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>Projects</h2>
              <div className="space-y-5">
                {validProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold">{proj.title}</h3>
                      {proj.link && <p className="text-xs italic">{proj.link}</p>}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-4 mt-1">
                      {proj.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {validCustomSections.map((section) => (
            <section key={section.id} className="mb-6">
              <h2 className="font-bold text-sm tracking-[0.15em] uppercase mb-3" style={{color: '#2c3e50'}}>{section.title}</h2>
              <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold">{section.subtitle}</h3>
                    <ul className="list-disc list-inside space-y-1 text-xs pl-4 mt-1">
                      {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
