import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useGetContent, useUpdateContent } from '../../hooks/useContent';
import { useGetSkills } from '../../hooks/useQueries';
import type { Content } from '../../backend';
import EducationEditor from './EducationEditor';
import ExperienceEditor from './ExperienceEditor';
import CertificationsEditor from './CertificationsEditor';
import HobbiesEditor from './HobbiesEditor';
import ProjectsEditor from './ProjectsEditor';
import SkillsEditor from './SkillsEditor';

interface ContentEditorProps {
  onBack: () => void;
  ownerPassword: string;
}

export default function ContentEditor({ onBack, ownerPassword }: ContentEditorProps) {
  const { data: content, isLoading: contentLoading } = useGetContent();
  const { data: skills, isLoading: skillsLoading } = useGetSkills();
  const updateMutation = useUpdateContent();

  const [draftContent, setDraftContent] = useState<Content | null>(null);
  const [draftSkills, setDraftSkills] = useState<string[]>([]);

  useEffect(() => {
    if (content) {
      setDraftContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (skills) {
      setDraftSkills(skills);
    }
  }, [skills]);

  const handleSave = async () => {
    if (!draftContent) return;

    try {
      await updateMutation.mutateAsync(draftContent);
    } catch (err) {
      console.error('Failed to save content:', err);
    }
  };

  if (contentLoading || skillsLoading || !draftContent) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-navy hover:text-navy/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <h3 className="text-xl font-bold text-navy">Edit Website Content</h3>

      {updateMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Failed to save changes</p>
            <p className="text-red-600 text-sm mt-1">
              {updateMutation.error instanceof Error ? updateMutation.error.message : 'Please try again.'}
            </p>
          </div>
        </div>
      )}

      {updateMutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Changes saved successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Hero Text */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-medium text-navy mb-2">
            Hero Text
          </label>
          <textarea
            value={draftContent.heroText}
            onChange={(e) =>
              setDraftContent({ ...draftContent, heroText: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-navy mb-4">Contact Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={draftContent.contact.address}
                onChange={(e) =>
                  setDraftContent({
                    ...draftContent,
                    contact: { ...draftContent.contact, address: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                value={draftContent.contact.phone}
                onChange={(e) =>
                  setDraftContent({
                    ...draftContent,
                    contact: { ...draftContent.contact, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={draftContent.contact.email}
                onChange={(e) =>
                  setDraftContent({
                    ...draftContent,
                    contact: { ...draftContent.contact, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <EducationEditor
          education={draftContent.education}
          onUpdate={(education) =>
            setDraftContent({ ...draftContent, education })
          }
        />

        {/* Experience */}
        <ExperienceEditor
          experience={draftContent.experience}
          onUpdate={(experience) =>
            setDraftContent({ ...draftContent, experience })
          }
        />

        {/* Skills */}
        <SkillsEditor
          skills={draftSkills}
          onChange={setDraftSkills}
          ownerPassword={ownerPassword}
        />

        {/* Certifications */}
        <CertificationsEditor
          certifications={draftContent.certifications}
          onUpdate={(certifications) =>
            setDraftContent({ ...draftContent, certifications })
          }
        />

        {/* Hobbies */}
        <HobbiesEditor
          hobbies={draftContent.hobbies}
          onUpdate={(hobbies) =>
            setDraftContent({ ...draftContent, hobbies })
          }
        />

        {/* Projects */}
        <ProjectsEditor
          content={draftContent}
          onUpdate={(updatedContent) => setDraftContent(updatedContent)}
        />
      </div>

      {/* Save button at bottom */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
