import { useState } from 'react';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useGetContent, useUpdateContent } from '../../hooks/useContent';
import ProjectsEditor from './ProjectsEditor';
import type { Content } from '../../backend';

interface ContentEditorProps {
  onBack: () => void;
  ownerPassword: string;
}

export default function ContentEditor({ onBack, ownerPassword }: ContentEditorProps) {
  const { data: content, isLoading } = useGetContent();
  const updateContent = useUpdateContent();
  const [heroText, setHeroText] = useState('');
  const [skills, setSkills] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize form when content loads
  if (content && !hasLoaded) {
    setHeroText(content.heroText);
    setSkills(content.skills.join(', '));
    setHobbies(content.hobbies.join(', '));
    setHasLoaded(true);
  }

  const handleSave = async () => {
    if (!content) return;

    const updatedContent: Content = {
      ...content,
      heroText: heroText.trim(),
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      hobbies: hobbies.split(',').map(h => h.trim()).filter(h => h),
    };

    try {
      setSaveError(null);
      await updateContent.mutateAsync({ content: updatedContent, password: ownerPassword });
    } catch (error) {
      console.error('Failed to update content:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes. Please check your password.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading content...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load content.
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
          disabled={updateContent.isPending}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          {updateContent.isPending ? (
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

      <h3 className="text-xl font-bold text-navy">Edit Website Content</h3>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Save Failed</p>
            <p className="text-red-600 text-sm mt-1">{saveError}</p>
          </div>
        </div>
      )}

      {updateContent.isSuccess && !saveError && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 font-medium">Changes saved successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="heroText" className="block text-sm font-medium text-gray-700 mb-2">
            Hero Tagline
          </label>
          <input
            type="text"
            id="heroText"
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            placeholder="Your professional tagline"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
            Skills (comma-separated)
          </label>
          <textarea
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
            placeholder="Python, JavaScript, React, etc."
          />
        </div>

        <div>
          <label htmlFor="hobbies" className="block text-sm font-medium text-gray-700 mb-2">
            Hobbies & Interests (comma-separated)
          </label>
          <textarea
            id="hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
            placeholder="Reading, Coding, Travel, etc."
          />
        </div>

        <ProjectsEditor 
          content={content} 
          onUpdate={(newContent) => updateContent.mutate({ content: newContent, password: ownerPassword })} 
        />
      </div>
    </div>
  );
}
