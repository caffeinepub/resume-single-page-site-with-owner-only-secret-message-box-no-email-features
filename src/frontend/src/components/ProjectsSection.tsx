import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import Section from './Section';
import type { Project } from '../backend';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const toggleProject = (index: number) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section id="projects" title="Projects">
      <div className="max-w-4xl mx-auto space-y-6">
        {projects.map((project, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-navy mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
              </div>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors mb-3"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">View Project</span>
              </a>
            )}

            {project.details && (
              <>
                <button
                  onClick={() => toggleProject(index)}
                  className="flex items-center gap-2 text-navy hover:text-navy/80 transition-colors text-sm font-medium"
                >
                  {expandedProjects.has(index) ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      See More
                    </>
                  )}
                </button>

                {expandedProjects.has(index) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-gray-700 whitespace-pre-wrap">{project.details}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
