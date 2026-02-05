import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Content, Project } from '../../backend';

interface ProjectsEditorProps {
  content: Content;
  onUpdate: (content: Content) => void;
}

export default function ProjectsEditor({ content, onUpdate }: ProjectsEditorProps) {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const addProject = () => {
    const newProject: Project = {
      title: 'New Project',
      description: 'Project description',
      link: '',
      details: '',
    };
    onUpdate({
      ...content,
      projects: [...content.projects, newProject],
    });
    setExpandedProject(content.projects.length);
  };

  const removeProject = (index: number) => {
    onUpdate({
      ...content,
      projects: content.projects.filter((_, i) => i !== index),
    });
    if (expandedProject === index) {
      setExpandedProject(null);
    }
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...content.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };
    onUpdate({
      ...content,
      projects: updatedProjects,
    });
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-navy">Projects</h4>
        <button
          onClick={addProject}
          className="flex items-center gap-2 text-sm bg-navy text-white px-3 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {content.projects.map((project, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setExpandedProject(expandedProject === index ? null : index)}
                className="flex items-center gap-2 text-navy hover:text-navy/80 transition-colors font-medium"
              >
                {expandedProject === index ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {project.title}
              </button>
              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedProject === index && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link
                  </label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details (shown when expanded)
                  </label>
                  <textarea
                    value={project.details}
                    onChange={(e) => updateProject(index, 'details', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {content.projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects yet. Click "Add Project" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
