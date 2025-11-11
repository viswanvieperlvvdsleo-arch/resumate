
import type { ResumeData } from '@/types/resume';
import Image from 'next/image';
import type { FC } from 'react';
import { Mail, Phone, Linkedin, Github, Globe, MapPin, Briefcase, Code, Star, Languages, Heart, Award, BrainCircuit, Mic } from 'lucide-react';

const iconMap: { [key: string]: React.ReactNode } = {
  briefcase: <Briefcase className="w-6 h-6" />,
  code: <Code className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
  languages: <Languages className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  'brain-circuit': <BrainCircuit className="w-6 h-6" />,
  mic: <Mic className="w-6 h-6" />,
};

const getIcon = (iconName: string) => {
    return iconMap[iconName] || <Briefcase className="w-6 h-6" />;
}

const CreativeTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skillsList = data.skills?.flatMap(g => g.skills.split(',')).map(s => s.trim()).filter(Boolean) || [];
  const validProjects = data.projects?.filter(p => p.title || p.description) || [];
  const validExperience = data.experience?.filter(e => e.company || e.role) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];

  const Section: FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({ title, icon, children}) => (
    <section className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-4" style={{ color: 'var(--resume-primary-color)'}}>
            {icon}
        </div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--resume-heading-font)', color: 'var(--resume-primary-color)' }}>{title}</h2>
      </div>
      {children}
    </section>
  );

  return (
    <div
      className="bg-white text-gray-700 min-h-full"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        color: 'var(--text-color)',
        fontSize: `var(--resume-body-font-size)`,
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="relative bg-[#2C3E50] text-white p-10 pb-20">
        <div className="flex items-center">
          <div className="flex-1 pr-10">
            <h1 className="text-5xl font-bold" style={{ fontFamily: 'var(--resume-heading-font)' }}>{data.fullName}</h1>
            <p className="text-2xl text-yellow-400 mt-2" style={{ fontFamily: 'var(--resume-heading-font)' }}>{data.title}</p>
            {data.about && <p className="mt-4 text-gray-300 leading-relaxed">{data.about}</p>}
          </div>
          <div className="w-40 h-40 relative flex-shrink-0">
            {data.profilePicture ? (
              <Image src={data.profilePicture} alt="Profile" layout="fill" className="rounded-full object-cover border-4 border-white" />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center text-center">
                  <span className="text-gray-500 text-sm">Add Your Image</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full"></div>
      </header>

      {/* Body */}
      <div className="p-10 grid grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="col-span-2">
            {validExperience.length > 0 && (
                 <Section title="WORK EXPERIENCE" icon={getIcon('briefcase')}>
                    {validExperience.map((exp, index) => (
                        <div key={exp.id || index} className="mb-6">
                            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--resume-heading-font)' }}>{exp.role}</h3>
                            <p className="font-semibold">{exp.company}</p>
                            <p className="text-sm text-yellow-500 my-1">{exp.date}</p>
                            <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                                {exp.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                            </ul>
                        </div>
                    ))}
                 </Section>
            )}

            {validEducation.length > 0 && (
                <Section title="EDUCATION" icon={getIcon('star')}>
                    {validEducation.map((edu, index) => (
                        <div key={edu.id || index} className="mb-4">
                            <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--resume-heading-font)' }}>{edu.degree}</h3>
                            <p className="font-semibold">{edu.institution}</p>
                            <p className="text-sm text-yellow-500">{edu.date}</p>
                        </div>
                    ))}
                </Section>
            )}

            {validCustomSections.map((section, index) => (
                 <Section key={section.id || index} title={section.title.toUpperCase()} icon={getIcon(section.icon)}>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--resume-heading-font)' }}>{section.subtitle}</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                            {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                        </ul>
                    </div>
                 </Section>
            ))}
        </div>

        {/* Right Column */}
        <div className="col-span-1">
            <aside>
                <div className="space-y-3 text-sm mb-8">
                    {data.contact.email && <div className="flex items-center"><Mail className="w-4 h-4 mr-3" /><span>{data.contact.email}</span></div>}
                    {data.contact.phone && <div className="flex items-center"><Phone className="w-4 h-4 mr-3" /><span>{data.contact.phone}</span></div>}
                    {data.address && <div className="flex items-center"><MapPin className="w-4 h-4 mr-3" /><span>{data.address}</span></div>}
                    {data.contact.linkedin && <div className="flex items-center"><Linkedin className="w-4 h-4 mr-3" /><span>{data.contact.linkedin}</span></div>}
                    {data.contact.github && <div className="flex items-center"><Github className="w-4 h-4 mr-3" /><span>{data.contact.github}</span></div>}
                </div>

                {skillsList.length > 0 && (
                    <Section title="GENERAL SKILLS" icon={getIcon('brain-circuit')}>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {skillsList.map((skill, index) => <p key={index}>{skill}</p>)}
                        </div>
                    </Section>
                )}

                {validProjects.length > 0 && (
                    <Section title="PERSONAL PROJECTS" icon={getIcon('code')}>
                         {validProjects.map((proj, index) => (
                            <div key={proj.id || index} className="mb-4">
                                <h3 className="font-bold text-md">{proj.title}</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm mt-1">
                                    {proj.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                                </ul>
                                {proj.link && <a href={proj.link} className="text-sm text-blue-600 hover:underline">{proj.link}</a>}
                            </div>
                        ))}
                    </Section>
                )}

                {validCertificates.length > 0 && (
                  <Section title="CERTIFICATES" icon={getIcon('award')}>
                      {validCertificates.map((cert, index) => (
                          <div key={cert.id || index} className="mb-4">
                              <h3 className="text-md font-bold">{cert.name}</h3>
                              <p className="font-semibold text-sm">{cert.issuer}</p>
                              <p className="text-sm text-gray-500">{cert.date}</p>
                          </div>
                      ))}
                  </Section>
                )}
            </aside>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
