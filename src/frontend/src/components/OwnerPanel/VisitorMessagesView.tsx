import { useState } from 'react';
import { ArrowLeft, Mail, User, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { useGetVisitorMessages, useClearVisitorMessages } from '../../hooks/useVisitorMessages';
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

interface VisitorMessagesViewProps {
  onBack: () => void;
  ownerPassword: string;
}

export default function VisitorMessagesView({ onBack, ownerPassword }: VisitorMessagesViewProps) {
  const { data: messages, isLoading, error } = useGetVisitorMessages(ownerPassword);
  const clearMutation = useClearVisitorMessages();
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

  // Sort messages by timestamp, newest first
  const sortedMessages = messages ? [...messages].sort((a, b) => {
    return Number(b.timestamp - a.timestamp);
  }) : [];

  const handleClearAll = async () => {
    try {
      await clearMutation.mutateAsync(ownerPassword);
      setShowConfirmDialog(false);
    } catch (err) {
      console.error('Failed to clear messages:', err);
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

        {sortedMessages.length > 0 && !error && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirmDialog(true)}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {clearMutation.isPending ? 'Clearing...' : 'Clear all messages'}
          </Button>
        )}
      </div>

      <h3 className="text-xl font-bold text-navy">Visitor Messages</h3>

      {clearMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            {clearMutation.error instanceof Error ? clearMutation.error.message : 'Failed to clear messages. Please try again.'}
          </p>
        </div>
      )}

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-800 font-medium mb-2">Authorization Error</p>
          <p className="text-red-600 text-sm">
            {error instanceof Error ? error.message : 'Failed to load messages. Please check your password.'}
          </p>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading messages...</p>
        </div>
      ) : sortedMessages.length > 0 ? (
        <div className="space-y-4">
          {sortedMessages.map((msg, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-navy" />
                  <span className="font-medium text-navy">{msg.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(msg.timestamp)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${msg.email}`} className="hover:text-navy transition-colors">
                  {msg.email}
                </a>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No visitor messages yet</p>
          <p className="text-gray-400 text-sm mt-1">Messages submitted through the contact form will appear here</p>
        </div>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all visitor messages?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All visitor messages will be permanently deleted from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Clear all messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
