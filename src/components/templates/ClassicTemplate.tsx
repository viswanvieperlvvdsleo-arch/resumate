
import type { ResumeData } from '@/types/resume';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import type { FC } from 'react';

const ClassicTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skills = data.skills?.flatMap(group => group.skills.split(',').map(s => s.trim())).filter(s => s) || [];
  const validProjects = data.projects.filter(p => p.title);
  const validEducation = data.education.filter(e => e.institution);
  const validExperience = data.experience?.filter(e => e.company) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];

  const baseBodySize = 'var(--resume-body-font-size)';
  const baseHeadingSize = 'var(--resume-heading-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  return (
    <div 
      className="p-8 bg-white font-serif"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        color: 'var(--text-color)',
        fontSize: baseBodySize,
      } as React.CSSProperties}
    >
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 
          className="font-bold tracking-wider"
          style={{ 
            color: 'var(--primary-color)',
            fontFamily: 'var(--resume-heading-font)',
            fontSize: baseHeadingSize,
          }}
        >
          {data.fullName}
        </h1>
        <p 
          className="mt-2" 
          style={{ 
            color: 'var(--primary-color)', 
            opacity: 0.8,
            fontSize: `calc(${baseSubHeadingSize} * 0.8)`,
          }}
        >
          {data.title}
        </p>
      </header>
      
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-8" style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: `calc(${baseBodySize} * 0.9)`}}>
        {data.contact.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /><span>{data.contact.email}</span></div>}
        {data.contact.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /><span>{data.contact.phone}</span></div>}
        {data.contact.linkedin && <div className="flex items-center"><Linkedin className="w-4 h-4 mr-2" /><span>{data.contact.linkedin}</span></div>}
        {data.contact.github && <div className="flex items-center"><Github className="w-4 h-4 mr-2" /><span>{data.contact.github}</span></div>}
      </div>

      <main>
        {data.about && <section className="mb-6">
          <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>About Me</h2>
          <p className="leading-relaxed">{data.about}</p>
        </section>}

        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-gray-200 px-3 py-1 rounded-full" style={{ color: '#333', fontSize: `calc(${baseBodySize} * 0.9)` }}>{skill}</span>
              ))}
            </div>
          </section>
        )}

        {validExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Experience</h2>
            <div className="space-y-4">
              {validExperience.map((exp, index) => (
                <div key={exp.id || index}>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.85)` }}>{exp.role} at {exp.company}</h3>
                  <p className="text-sm italic">{exp.date}</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                    {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {validProjects.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Projects</h2>
            <div className="space-y-4">
              {validProjects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.85)` }}>{project.title}</h3>
                  <p className="mt-1">{project.description}</p>
                  {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--primary-color)', fontSize: `calc(${baseBodySize} * 0.9)` }}>{project.link}</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {validCertificates.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Certificates</h2>
            <div className="space-y-4">
              {validCertificates.map((cert, index) => (
                <div key={cert.id || index}>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.85)` }}>{cert.name}</h3>
                  <div className="flex justify-between">
                    <span>{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {validCustomSections.map((section) => (
            <section key={section.id} className="mb-6">
              <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>{section.title}</h2>
              <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.85)` }}>{section.subtitle}</h3>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                      {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                    </ul>
                  </div>
              </div>
            </section>
        ))}

        {validEducation.length > 0 && (
          <section>
            <h2 className="font-bold border-b border-gray-200 pb-2 mb-3" style={{ color: 'var(--primary-color)', fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Education</h2>
            <div className="space-y-4">
              {validEducation.map((edu, index) => (
                <div key={edu.id || index}>
                  <h3 className="font-semibold" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: `calc(${baseSubHeadingSize} * 0.85)` }}>{edu.institution}</h3>
                  <div className="flex justify-between">
                    <span>{edu.degree}</span>
                    <span>{edu.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ClassicTemplate;
