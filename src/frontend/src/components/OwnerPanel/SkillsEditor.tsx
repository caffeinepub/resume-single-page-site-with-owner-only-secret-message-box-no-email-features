import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useAddSkill, useRemoveSkill } from '../../hooks/useQueries';
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
  onChange: (skills: string[]) => void;
  ownerPassword: string;
}

export default function SkillsEditor({ skills, onChange, ownerPassword }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addMutation = useAddSkill();
  const removeMutation = useRemoveSkill();

  const handleAdd = async () => {
    if (!newSkill.trim()) return;

    try {
      await addMutation.mutateAsync(newSkill.trim());
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(skills[index]);
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editValue.trim()) return;

    const oldSkill = skills[editingIndex];
    const newSkills = [...skills];
    newSkills[editingIndex] = editValue.trim();

    try {
      // Remove old skill and add new one
      await removeMutation.mutateAsync(oldSkill);
      await addMutation.mutateAsync(editValue.trim());
      onChange(newSkills);
      setEditingIndex(null);
      setEditValue('');
    } catch (err) {
      console.error('Failed to edit skill:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;

    const skillToDelete = skills[deleteIndex];

    try {
      await removeMutation.mutateAsync(skillToDelete);
      onChange(skills.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-lg font-semibold text-navy mb-4">Skills</h4>

      {/* Add new skill */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add new skill"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          disabled={addMutation.isPending}
        />
        <button
          onClick={handleAdd}
          disabled={!newSkill.trim() || addMutation.isPending}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {addMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>

      {/* Skills list */}
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-navy focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                  disabled={removeMutation.isPending || addMutation.isPending}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-800">{skill}</span>
                <button
                  onClick={() => handleEdit(index)}
                  className="text-navy hover:text-navy/80 p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteIndex(index)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-gray-500 text-center py-4">No skills added yet.</p>
      )}

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete skill?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteIndex !== null ? skills[deleteIndex] : ''}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
