
import type { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { FC } from 'react';

const TimelineTemplate: FC<{ data: ResumeData }> = ({ data }) => {
    const skillsGroups = data.skills?.filter(g => g.groupName && g.skills) || [];

  const validExperience = data.experience?.filter(p => p.company) || [];
  const validEducation = data.education?.filter(e => e.institution) || [];
  const validProjects = data.projects?.filter(p => p.title || p.description) || [];
  const validReferences = data.references?.filter(r => r.name || r.details) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];


  const baseBodySize = 'var(--resume-body-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  const getFontSize = (base: string, multiplier: number) => `calc(${base} * ${multiplier})`;

  const Section: FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="flex">
        <div className="w-1/3 pr-8 text-right relative">
            <h2 className="font-bold text-sm uppercase tracking-wider text-gray-500 sticky top-10">{title}</h2>
            <div className="absolute right-0 top-2 transform translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="w-2/3 pl-8 pb-12">
            {children}
        </div>
    </div>
  );

  return (
    <div 
      className="bg-white font-sans h-full text-gray-700"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        fontSize: baseBodySize,
      } as React.CSSProperties}
    >
      <div className="p-10">
        {/* Header */}
        <header className="mb-10">
            <h1 
                className="text-4xl font-bold"
                style={{ 
                fontFamily: 'var(--resume-heading-font)',
                fontSize: `var(--resume-heading-font-size)`,
                color: 'var(--primary-color)'
                }}
            >
                {data.fullName}
            </h1>
            <p className="text-xl opacity-90" style={{ fontSize: baseSubHeadingSize }}>{data.title}</p>

            <div className="grid grid-cols-2 gap-4 mt-4 text-sm" style={{color: 'var(--text-color)'}}>
                {data.contact.phone && <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{data.contact.phone}</span>
                </div>}
                 {data.contact.email && <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{data.contact.email}</span>
                </div>}
                {data.address && <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{data.address}</span>
                </div>}
                {data.contact.github && <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{data.contact.github}</span>
                </div>}
            </div>
        </header>

        {/* Main Content */}
        <div className="relative">
            <div className="absolute left-1/3 top-2 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
            
            {data.about && (
              <Section title="Summary">
                  <p className="text-sm leading-relaxed">{data.about}</p>
              </Section>
            )}

            {skillsGroups.length > 0 && (
                <Section title="Skills">
                    <div className="space-y-3">
                        {skillsGroups.map((group, index) => (
                            <div key={index} className="flex items-center text-sm border rounded">
                                <div className="bg-gray-700 text-white font-semibold px-3 py-1">{group.groupName}</div>
                                <div className="flex flex-wrap gap-x-2 gap-y-1 p-2">
                                    {group.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                                        <span key={i} className="border-b-2 border-gray-300 px-2">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {validExperience.length > 0 && (
                 <Section title="Work Experience">
                     <div className="space-y-6">
                        {validExperience.map((exp, index) => (
                            <div key={exp.id || index}>
                                <h3 className="font-bold">{exp.company}</h3>
                                <p className="font-semibold text-gray-600">{exp.role}</p>
                                <p className="text-xs text-gray-500">{exp.date}</p>
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                                    {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                                </ul>
                            </div>
                        ))}
                     </div>
                </Section>
            )}

            {validEducation.length > 0 && (
                 <Section title="Education">
                    <div className="space-y-4">
                        {validEducation.map((edu, index) => (
                            <div key={edu.id || index}>
                                <h3 className="font-bold">{edu.degree}</h3>
                                <p className="font-semibold text-gray-600">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.date}</p>
                            </div>
                        ))}
                    </div>
                 </Section>
            )}

            {validCertificates.length > 0 && (
              <Section title="Certificates">
                <div className="space-y-4">
                  {validCertificates.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-bold">{cert.name}</h3>
                      <p className="font-semibold text-gray-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {validProjects.length > 0 && (
                <Section title="Projects">
                    <div className="space-y-6">
                        {validProjects.map((proj, index) => (
                            <div key={proj.id || index}>
                                <h3 className="font-bold">{proj.title}</h3>
                                {proj.link && <p className="text-xs text-gray-500">{proj.link}</p>}
                                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                                    {proj.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {validCustomSections.map((section) => (
                <Section key={section.id} title={section.title}>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold">{section.subtitle}</h3>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                                {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    </div>
                </Section>
            ))}

           {validReferences.length > 0 && (
                <Section title="References">
                    <div className="space-y-4">
                        {validReferences.map((ref, index) => (
                            <div key={ref.id || index}>
                                <h3 className="font-bold">{ref.name}</h3>
                                <div className="whitespace-pre-line text-sm text-gray-600">{ref.details}</div>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
           
        </div>
      </div>
    </div>
  );
};

export default TimelineTemplate;
