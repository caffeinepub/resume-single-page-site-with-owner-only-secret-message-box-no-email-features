import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Certification } from '../../backend';
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

interface CertificationsEditorProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

export default function CertificationsEditor({ certifications, onUpdate }: CertificationsEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const addCertification = () => {
    const newCert: Certification = {
      name: 'New Certification',
      issuer: 'Issuing Organization',
      year: BigInt(new Date().getFullYear()),
    };
    onUpdate([...certifications, newCert]);
    setExpandedIndex(certifications.length);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      onUpdate(certifications.filter((_, i) => i !== deleteIndex));
      if (expandedIndex === deleteIndex) {
        setExpandedIndex(null);
      }
      setDeleteIndex(null);
    }
  };

  const updateCertification = (index: number, field: keyof Certification, value: string | bigint) => {
    const updated = [...certifications];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdate(updated);
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-navy">Certifications</h4>
        <button
          onClick={addCertification}
          className="flex items-center gap-2 text-sm bg-navy text-white px-3 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
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
                {cert.name}
              </button>
              <button
                onClick={() => setDeleteIndex(index)}
                className="text-red-600 hover:text-red-700 transition-colors"
                title="Delete certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Name
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={Number(cert.year)}
                    onChange={(e) => updateCertification(index, 'year', BigInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No certifications yet. Click "Add Certification" to create one.
          </div>
        )}
      </div>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteIndex !== null ? certifications[deleteIndex].name : ''}"? This action cannot be undone.
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
