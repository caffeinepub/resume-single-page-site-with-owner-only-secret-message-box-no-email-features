import { useState } from 'react';
import { useLogRecruiterVisit } from '../hooks/useRecruiterVisit';
import { Loader2 } from 'lucide-react';

interface RecruiterPromptModalProps {
  onComplete: () => void;
}

export default function RecruiterPromptModal({ onComplete }: RecruiterPromptModalProps) {
  const [isRecruiter, setIsRecruiter] = useState<boolean | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const logVisit = useLogRecruiterVisit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRecruiter === null) {
      setError('Please select an option');
      return;
    }

    if (isRecruiter && !companyName.trim()) {
      setError('Please enter your company name');
      return;
    }

    try {
      await logVisit.mutateAsync({
        isRecruiter,
        companyName: isRecruiter ? companyName.trim() : null,
      });
      onComplete();
    } catch (err) {
      console.error('Failed to log visit:', err);
      // Still allow them to proceed even if logging fails
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-navy/95 via-navy/90 to-blue-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-navy mb-2">Welcome!</h2>
        <p className="text-gray-600 mb-6">
          Before you explore, we'd like to know a bit about you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Are you a recruiter?
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsRecruiter(true)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  isRecruiter === true
                    ? 'border-navy bg-navy/5 text-navy font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                Yes, I'm a recruiter
              </button>
              <button
                type="button"
                onClick={() => setIsRecruiter(false)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  isRecruiter === false
                    ? 'border-navy bg-navy/5 text-navy font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                No, I'm just visiting
              </button>
            </div>
          </div>

          {isRecruiter && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter your company name"
                autoFocus
              />
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={logVisit.isPending}
            className="w-full bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {logVisit.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Continue to Resume'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
