import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { EducationEntry } from '../../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface EducationEditorProps {
  education: EducationEntry[];
  onUpdate: (education: EducationEntry[]) => void;
}

export default function EducationEditor({ education, onUpdate }: EducationEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addEducation = () => {
    const newEntry: EducationEntry = {
      institution: 'New Institution',
      degree: 'Degree Name',
      year: BigInt(new Date().getFullYear()),
    };
    onUpdate([...education, newEntry]);
    setExpandedIndex(education.length);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onUpdate(education.filter((_, i) => i !== deleteIndex));
      if (expandedIndex === deleteIndex) {
        setExpandedIndex(null);
      }
      setDeleteIndex(null);
    }
  };

  const updateEducation = (index: number, field: keyof EducationEntry, value: string | bigint) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate(updated);
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-navy">Education</h4>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 text-sm bg-navy text-white px-3 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {education.map((entry, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex items-center gap-2 text-navy hover:text-navy/80 transition-colors font-medium"
              >
                {expandedIndex === index ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {entry.institution}
              </button>
              <button
                onClick={() => setDeleteIndex(index)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Delete education entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={entry.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={entry.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={Number(entry.year)}
                    onChange={(e) => updateEducation(index, 'year', BigInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No education entries yet. Click "Add Education" to create one.
          </div>
        )}
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Education Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteIndex !== null ? education[deleteIndex].institution : ''}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
