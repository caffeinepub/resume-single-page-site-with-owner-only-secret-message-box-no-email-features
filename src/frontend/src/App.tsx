import { useEffect, useState } from 'react';
import TopNav from './components/TopNav';
import Section from './components/Section';
import RecruiterPromptModal from './components/RecruiterPromptModal';
import VisitorMessageForm from './components/VisitorMessageForm';
import ProjectsSection from './components/ProjectsSection';
import OwnerAccessPanel from './components/OwnerPanel/OwnerAccessPanel';
import { useGetContent } from './hooks/useContent';
import { useGetSkills } from './hooks/useQueries';
import { resumeContent } from './resumeContent';
import { appConfig } from './appConfig';
import { Mail, MapPin, Phone, Linkedin } from 'lucide-react';

export default function App() {
  const [recruiterPromptCompleted, setRecruiterPromptCompleted] = useState(false);
  const [showOwnerPanel, setShowOwnerPanel] = useState(false);
  const { data: content, isLoading: contentLoading } = useGetContent();
  const { data: skills, isLoading: skillsLoading } = useGetSkills();

  // Set document title based on app configuration
  useEffect(() => {
    document.title = appConfig.appName;
  }, []);

  // Use backend content if available, fallback to static content
  const displayContent = content || {
    heroText: resumeContent.hero.tagline,
    education: [],
    experience: [],
    certifications: [],
    hobbies: [],
    projects: [],
    contact: {
      address: resumeContent.hero.location,
      phone: resumeContent.hero.phone,
      email: resumeContent.hero.email,
    },
  };

  // Use backend skills if available
  const displaySkills = skills || [];

  // Contact details with fallback
  const contactPhone = content?.contact?.phone || resumeContent.hero.phone;
  const contactAddress = content?.contact?.address || resumeContent.hero.location;
  const contactEmail = content?.contact?.email || resumeContent.hero.email;

  // Don't show main content until recruiter prompt is completed
  if (!recruiterPromptCompleted) {
    return <RecruiterPromptModal onComplete={() => setRecruiterPromptCompleted(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <TopNav />
      
      <main className="relative">
        {/* Hero Section */}
        <Section id="hero" className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-navy mb-4 tracking-tight">
              {resumeContent.hero.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 italic">
              {displayContent.heroText}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-gray-700">
              <a href={`tel:${contactPhone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="w-5 h-5" />
                <span>{contactPhone}</span>
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{contactAddress}</span>
              </span>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="w-5 h-5" />
                <span>{contactEmail}</span>
              </a>
              <a 
                href={resumeContent.hero.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </Section>

        {/* Education Section */}
        <Section id="education" title="Education">
          <div className="max-w-4xl mx-auto">
            {displayContent.education.length > 0 ? (
              <div className="space-y-6">
                {displayContent.education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
                    <h3 className="text-2xl font-bold text-navy mb-1">{edu.institution}</h3>
                    <p className="text-lg text-gray-600 mb-2">{edu.degree}</p>
                    <p className="text-gray-600">Year: {Number(edu.year)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-1">
                      {resumeContent.education.school}
                    </h3>
                    <p className="text-lg text-gray-600">{resumeContent.education.degree}</p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-gray-600">{resumeContent.education.location}</p>
                    <p className="text-gray-600">{resumeContent.education.date}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-gold/10 text-gold px-4 py-2 rounded-full font-semibold">
                    GPA: {resumeContent.education.gpa}
                  </span>
                  <span className="inline-block bg-navy/10 text-navy px-4 py-2 rounded-full font-semibold ml-2">
                    {resumeContent.education.minor}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed italic border-l-4 border-gold pl-4">
                  {resumeContent.education.summary}
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Experience Section */}
        <Section id="experience" title="Experience">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayContent.experience.length > 0 ? (
              displayContent.experience.map((job, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-1">{job.position}</h3>
                      <p className="text-lg text-gray-600">{job.company}</p>
                    </div>
                    <p className="text-gray-600 mt-2 md:mt-0">{job.duration}</p>
                  </div>
                  <p className="text-gray-700">{job.description}</p>
                </div>
              ))
            ) : (
              resumeContent.experience.map((job, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy mb-1">{job.title}</h3>
                      <p className="text-lg text-gray-600">{job.company}</p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-gray-600">{job.location}</p>
                      <p className="text-gray-600">{job.date}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700">
                        <span className="text-gold mt-1.5 flex-shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* Technical Skills Section */}
        <Section id="skills" title="Technical Skills">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
              {displaySkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-navy/5 text-navy rounded-lg border border-navy/10 hover:bg-navy/10 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {resumeContent.skills.map((category, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-bold text-navy mb-3">{category.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-4 py-2 bg-navy/5 text-navy rounded-lg border border-navy/10 hover:bg-navy/10 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Certifications & Leadership Section */}
        <Section id="certifications" title="Certifications & Leadership">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
              {content && content.certifications.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.certifications.map((cert, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-gold/10 text-gold rounded-lg border border-gold/20 font-medium"
                        >
                          {cert.name} ({cert.issuer}, {Number(cert.year)})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeContent.certifications.map((cert, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-gold/10 text-gold rounded-lg border border-gold/20 font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-3">Leadership</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeContent.leadership.map((role, idx) => (
                        <span 
                          key={idx}
                          className="px-4 py-2 bg-navy/10 text-navy rounded-lg border border-navy/20 font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Projects Section */}
        <ProjectsSection projects={displayContent.projects} />

        {/* Hobbies Section */}
        <Section id="hobbies" title="Hobbies & Interests">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
              <div className="flex flex-wrap gap-3">
                {displayContent.hobbies.length > 0 ? (
                  displayContent.hobbies.map((hobby, idx) => (
                    <span 
                      key={idx}
                      className="px-5 py-3 bg-gradient-to-r from-navy/5 to-gold/5 text-gray-700 rounded-full border border-gray-200 font-medium"
                    >
                      {hobby}
                    </span>
                  ))
                ) : (
                  resumeContent.hobbies.map((hobby, idx) => (
                    <span 
                      key={idx}
                      className="px-5 py-3 bg-gradient-to-r from-navy/5 to-gold/5 text-gray-700 rounded-full border border-gray-200 font-medium"
                    >
                      {hobby}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Visitor Message Form */}
        <VisitorMessageForm />

        {/* Discreet clickable name in corner - opens Owner Access Panel */}
        <button
          onClick={() => setShowOwnerPanel(true)}
          className="fixed bottom-6 right-6 text-xs text-gray-400 hover:text-gold transition-colors cursor-pointer z-30"
        >
          {appConfig.ownerName}
        </button>

        {/* Footer */}
        <footer className="bg-navy text-white py-8 mt-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <p className="text-gray-300">
                © 2026. Built with ❤️ using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:underline"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Owner Access Panel */}
      {showOwnerPanel && (
        <OwnerAccessPanel onClose={() => setShowOwnerPanel(false)} />
      )}
    </div>
  );
}
