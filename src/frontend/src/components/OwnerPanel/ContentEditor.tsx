import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useGetContent, useUpdateContent } from '../../hooks/useContent';
import { useGetSkills, useAddSkill, useRemoveSkill } from '../../hooks/useQueries';
import ProjectsEditor from './ProjectsEditor';
import EducationEditor from './EducationEditor';
import ExperienceEditor from './ExperienceEditor';
import HobbiesEditor from './HobbiesEditor';
import SkillsEditor from './SkillsEditor';
import CertificationsEditor from './CertificationsEditor';
import type { Content } from '../../backend';

interface ContentEditorProps {
  onBack: () => void;
  ownerPassword: string;
}

export default function ContentEditor({ onBack, ownerPassword }: ContentEditorProps) {
  const { data: content, isLoading } = useGetContent();
  const { data: backendSkills, isLoading: skillsLoading } = useGetSkills();
  const updateContent = useUpdateContent();
  const addSkill = useAddSkill();
  const removeSkill = useRemoveSkill();
  
  const [draftContent, setDraftContent] = useState<Content | null>(null);
  const [draftSkills, setDraftSkills] = useState<string[]>([]);
  const [heroText, setHeroText] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize draft content when backend content loads
  useEffect(() => {
    if (content && !draftContent) {
      setDraftContent(content);
      setHeroText(content.heroText);
    }
  }, [content, draftContent]);

  // Initialize draft skills when backend skills load
  useEffect(() => {
    if (backendSkills && draftSkills.length === 0) {
      setDraftSkills(backendSkills);
    }
  }, [backendSkills, draftSkills.length]);

  const handleSave = async () => {
    if (!draftContent) return;

    const updatedContent: Content = {
      ...draftContent,
      heroText: heroText.trim(),
    };

    try {
      setSaveError(null);
      
      // Save content with owner password
      await updateContent.mutateAsync({ content: updatedContent, password: ownerPassword });
      
      // Sync skills: determine which to add and which to remove
      const currentSkills = backendSkills || [];
      const skillsToAdd = draftSkills.filter(skill => !currentSkills.includes(skill));
      const skillsToRemove = currentSkills.filter(skill => !draftSkills.includes(skill));
      
      // Add new skills
      for (const skill of skillsToAdd) {
        await addSkill.mutateAsync(skill);
      }
      
      // Remove deleted skills
      for (const skill of skillsToRemove) {
        await removeSkill.mutateAsync(skill);
      }
      
      // Update draft content with saved content to prevent stale state
      setDraftContent(updatedContent);
    } catch (error) {
      console.error('Failed to update content:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes. Please try again.');
    }
  };

  if (isLoading || skillsLoading || !draftContent) {
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
          disabled={updateContent.isPending || addSkill.isPending || removeSkill.isPending}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          {(updateContent.isPending || addSkill.isPending || removeSkill.isPending) ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Failed to save</p>
            <p className="text-red-700 text-sm mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {(updateContent.isSuccess && !updateContent.isPending) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">Changes saved successfully!</p>
        </div>
      )}

      {/* Hero Text Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-navy mb-4">Hero Tagline</h3>
        <input
          type="text"
          value={heroText}
          onChange={(e) => setHeroText(e.target.value)}
          placeholder="Enter hero tagline..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
        />
      </div>

      {/* Contact Details Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-navy mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address / Location
            </label>
            <input
              type="text"
              value={draftContent.contact.address}
              onChange={(e) => setDraftContent({
                ...draftContent,
                contact: { ...draftContent.contact, address: e.target.value }
              })}
              placeholder="e.g., Turku, Finland"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={draftContent.contact.phone}
              onChange={(e) => setDraftContent({
                ...draftContent,
                contact: { ...draftContent.contact, phone: e.target.value }
              })}
              placeholder="e.g., +358 49 5029094"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={draftContent.contact.email}
              onChange={(e) => setDraftContent({
                ...draftContent,
                contact: { ...draftContent.contact, email: e.target.value }
              })}
              placeholder="e.g., your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
        </div>
      </div>

      {/* Education Section */}
      <EducationEditor
        education={draftContent.education}
        onUpdate={(education) => setDraftContent({ ...draftContent, education })}
      />

      {/* Experience Section */}
      <ExperienceEditor
        experience={draftContent.experience}
        onUpdate={(experience) => setDraftContent({ ...draftContent, experience })}
      />

      {/* Skills Section */}
      <SkillsEditor
        skills={draftSkills}
        onUpdate={setDraftSkills}
      />

      {/* Certifications Section */}
      <CertificationsEditor
        certifications={draftContent.certifications}
        onUpdate={(certifications) => setDraftContent({ ...draftContent, certifications })}
      />

      {/* Projects Section */}
      <ProjectsEditor
        content={draftContent}
        onUpdate={setDraftContent}
      />

      {/* Hobbies Section */}
      <HobbiesEditor
        hobbies={draftContent.hobbies}
        onUpdate={(hobbies) => setDraftContent({ ...draftContent, hobbies })}
      />
    </div>
  );
}
