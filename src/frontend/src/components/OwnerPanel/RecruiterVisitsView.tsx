import { useState } from 'react';
import { ArrowLeft, Building2, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { useGetRecruiterVisits, useClearRecruiterVisits } from '../../hooks/useRecruiterVisit';
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
import { Button } from '@/components/ui/button';

interface RecruiterVisitsViewProps {
  onBack: () => void;
  ownerPassword: string;
}

export default function RecruiterVisitsView({ onBack, ownerPassword }: RecruiterVisitsViewProps) {
  const { data: visits, isLoading, error } = useGetRecruiterVisits(ownerPassword);
  const clearMutation = useClearRecruiterVisits(ownerPassword);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClearAll = async () => {
    try {
      await clearMutation.mutateAsync();
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Failed to clear visits:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-navy hover:text-navy/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </button>

        {visits && visits.length > 0 && !error && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirmDialog(true)}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {clearMutation.isPending ? 'Clearing...' : 'Clear all visits'}
          </Button>
        )}
      </div>

      <h3 className="text-xl font-bold text-navy">Recruiter Visits</h3>

      {clearMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            {clearMutation.error instanceof Error ? clearMutation.error.message : 'Failed to clear visits. Please try again.'}
          </p>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-800 font-medium mb-2">Authorization Error</p>
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : 'Failed to load visits. Please check your authorization.'}
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading visits...</p>
        </div>
      ) : visits && visits.length > 0 ? (
        <div className="space-y-3">
          {visits.map((visit, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-navy mt-1" />
                  <div>
                    <p className="font-medium text-navy">
                      {visit.companyName || 'Company name not provided'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(visit.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No recruiter visits recorded yet.
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all recruiter visits?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All recruiter visit logs will be permanently deleted from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Clear all visits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
