import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

interface HobbiesEditorProps {
  hobbies: string[];
  onUpdate: (hobbies: string[]) => void;
}

export default function HobbiesEditor({ hobbies, onUpdate }: HobbiesEditorProps) {
  const [newHobby, setNewHobby] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addHobby = () => {
    if (newHobby.trim()) {
      onUpdate([...hobbies, newHobby.trim()]);
      setNewHobby('');
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onUpdate(hobbies.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-lg font-bold text-navy mb-4">Hobbies & Interests</h4>

      <div className="space-y-3 mb-4">
        {hobbies.map((hobby, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <span className="text-gray-700">{hobby}</span>
            <button
              onClick={() => setDeleteIndex(index)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Delete hobby"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {hobbies.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No hobbies added yet. Add one below.
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHobby()}
          placeholder="Add a new hobby"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
        />
        <button
          onClick={addHobby}
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hobby</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteIndex !== null ? hobbies[deleteIndex] : ''}"? This action cannot be undone.
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
