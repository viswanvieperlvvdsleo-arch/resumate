
import type { ResumeData } from '@/types/resume';
import Image from 'next/image';
import type { FC } from 'react';

const ProfessionalTemplate: FC<{ data: ResumeData }> = ({ data }) => {
  const skillsList = data.skills?.map(g => ({
    name: g.groupName,
    level: g.skills, // This template uses the skills string as the level, e.g. "5/5"
  })).filter(s => s.name) || [];

  
  const validExperience = data.experience?.filter(p => p.company || p.role || p.description) || [];
  const validEducation = data.education?.filter(e => e.institution || e.degree) || [];
  const validReferences = data.references?.filter(r => r.name || r.details) || [];
  const validCertificates = data.certificates?.filter(c => c.name) || [];
  const validCustomSections = data.customSections?.filter(s => s.title || s.description) || [];


  const baseBodySize = 'var(--resume-body-font-size)';
  const baseSubHeadingSize = 'var(--resume-subheading-font-size)';

  const getFontSize = (base: string, multiplier: number) => `calc(${base} * ${multiplier})`;

  return (
    <div 
      className="flex bg-white font-sans h-full text-gray-800"
      style={{
        '--primary-color': 'var(--resume-primary-color)',
        '--text-color': 'var(--resume-text-color)',
        fontFamily: 'var(--resume-body-font)',
        fontSize: getFontSize(baseBodySize, 0.9),
      } as React.CSSProperties}
    >
      {/* Left Column */}
      <aside className="w-[35%] bg-gray-100 p-6 flex flex-col">
        {data.profilePicture ? (
          <div className="w-full aspect-[3/4] mb-4">
            <Image 
              src={data.profilePicture} 
              alt={data.fullName} 
              width={200}
              height={266}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
            <div className="w-full aspect-[3/4] mb-4 bg-gray-300 flex items-center justify-center text-center">
                <span className="text-gray-500 text-sm">Add Your Image</span>
            </div>
        )}
        <div style={{color: 'var(--text-color)'}}>
          <p className="font-bold">{data.title}</p>
          <p>{data.contact.email}</p>
          <p>{data.contact.phone}</p>
          <p className="mt-4">{data.address}</p>
        </div>
      </aside>
      
      {/* Right Column */}
      <main className="w-[65%] p-8" style={{ color: 'var(--text-color)' }}>
        <h1 
          className="font-bold text-4xl mb-4" 
          style={{ 
            fontFamily: 'var(--resume-heading-font)',
            fontSize: `var(--resume-heading-font-size)`,
            color: 'black'
          }}
        >
          {data.fullName}
        </h1>

        <section className="mb-6">
          <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Profile</h2>
          <p className="text-sm leading-relaxed">{data.about}</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Employment History</h2>
          <div className="space-y-4">
            {validExperience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="bg-gray-800 text-white p-1 inline-block text-sm font-bold">
                    <p>{exp.role} at {exp.company}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">{exp.date}</p>
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
                <p className="bg-gray-800 text-white p-1 inline-block text-sm font-bold">{edu.degree}, {edu.institution}</p>
                <p className="text-xs text-gray-600 mt-1">{edu.date}</p>
              </div>
            ))}
          </div>
        </section>

        {validCertificates.length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Certificates</h2>
            <div className="space-y-2">
              {validCertificates.map((cert, index) => (
                <div key={cert.id || index}>
                  <p className="bg-gray-800 text-white p-1 inline-block text-sm font-bold">{cert.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{cert.issuer} - {cert.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {validCustomSections.map((section) => (
          <section key={section.id} className="mb-6">
            <h2 className="font-bold text-lg border-b-2 border-gray-300 pb-1 mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>{section.title}</h2>
            <div className="space-y-4">
              <div>
                <div className="bg-gray-800 text-white p-1 inline-block text-sm font-bold">
                    <p>{section.subtitle}</p>
                </div>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  {section.description.split('\n').map((line, i) => line && <li key={i}>{line}</li>)}
                </ul>
              </div>
            </div>
          </section>
        ))}

        <div className="grid grid-cols-2 gap-8">
            {skillsList.length > 0 && (
                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>Skills</h2>
                    <div className="p-4 bg-gray-100 rounded-md">
                        {skillsList.map((skill, index) => (
                            <div key={index} className="flex justify-between items-center text-sm mb-1">
                                <span>{skill.name}</span>
                                <span className="font-mono">{skill.level}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {validReferences.length > 0 && (
                <section>
                    <h2 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--resume-heading-font)', fontSize: baseSubHeadingSize }}>References</h2>
                    <div className="p-4 bg-gray-100 rounded-md space-y-3">
                        {validReferences.map((ref, index) => (
                            <div key={ref.id || index} className="text-sm">
                                <p className="font-bold">{ref.name}</p>
                                <div className="text-xs whitespace-pre-line">{ref.details}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>

      </main>
    </div>
  );
};

export default ProfessionalTemplate;
