import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
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

interface SkillsEditorProps {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}

export default function SkillsEditor({ skills, onUpdate }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onUpdate([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(skills[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const trimmed = editValue.trim();
      if (trimmed && !skills.includes(trimmed)) {
        const updated = [...skills];
        updated[editingIndex] = trimmed;
        onUpdate(updated);
      }
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onUpdate(skills.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-lg font-bold text-navy mb-4">Technical Skills</h4>

      <div className="space-y-3 mb-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  autoFocus
                />
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-700 transition-colors"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-700 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="text-gray-700">{skill}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(index)}
                    className="text-navy hover:text-navy/80 transition-colors"
                    title="Edit skill"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteIndex(index)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Delete skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No skills added yet. Add one below.
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a new skill (e.g., Python, React, etc.)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
        />
        <button
          onClick={addSkill}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Skill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteIndex !== null ? skills[deleteIndex] : ''}"? This action cannot be undone.
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
