import { useState } from 'react';
import { X, Lock, Users, MessageSquare, FileEdit } from 'lucide-react';
import { OWNER_PANEL_PASSWORD } from '../../utils/ownerPanelAccess';
import RecruiterVisitsView from './RecruiterVisitsView';
import VisitorMessagesView from './VisitorMessagesView';
import ContentEditor from './ContentEditor';
import { useQueryClient } from '@tanstack/react-query';

interface OwnerAccessPanelProps {
  onClose: () => void;
}

type PanelView = 'password' | 'menu' | 'recruiterVisits' | 'visitorMessages' | 'contentEditor';

export default function OwnerAccessPanel({ onClose }: OwnerAccessPanelProps) {
  const [currentView, setCurrentView] = useState<PanelView>('password');
  const [password, setPassword] = useState('');
  const [unlockedPassword, setUnlockedPassword] = useState<string | null>(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === OWNER_PANEL_PASSWORD) {
      setUnlockedPassword(password);
      setCurrentView('menu');
      setPassword('');
      // Invalidate queries to fetch fresh data with the password
      queryClient.invalidateQueries({ queryKey: ['visitorMessages'] });
      queryClient.invalidateQueries({ queryKey: ['recruiterVisits'] });
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const renderContent = () => {
    if (currentView === 'password') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">Owner Access</h3>
            <p className="text-gray-600">
              Enter the owner password to access the panel.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="ownerPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Owner Password
              </label>
              <input
                type="password"
                id="ownerPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                placeholder="Enter password"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors font-medium"
            >
              Unlock
            </button>
          </form>
        </div>
      );
    }

    if (currentView === 'menu') {
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-navy mb-4">Owner Panel</h3>
          <button
            onClick={() => setCurrentView('recruiterVisits')}
            className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-all text-left"
          >
            <Users className="w-6 h-6 text-navy" />
            <div>
              <p className="font-medium text-navy">Recruiter Visits</p>
              <p className="text-sm text-gray-600">View who visited from recruiting companies</p>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('visitorMessages')}
            className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-all text-left"
          >
            <MessageSquare className="w-6 h-6 text-navy" />
            <div>
              <p className="font-medium text-navy">Visitor Messages</p>
              <p className="text-sm text-gray-600">Read messages from interested visitors</p>
            </div>
          </button>
          <button
            onClick={() => setCurrentView('contentEditor')}
            className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-navy hover:bg-navy/5 transition-all text-left"
          >
            <FileEdit className="w-6 h-6 text-navy" />
            <div>
              <p className="font-medium text-navy">Edit Website Content</p>
              <p className="text-sm text-gray-600">Update resume sections and projects</p>
            </div>
          </button>
        </div>
      );
    }

    if (currentView === 'recruiterVisits') {
      return <RecruiterVisitsView onBack={() => setCurrentView('menu')} ownerPassword={unlockedPassword!} />;
    }

    if (currentView === 'visitorMessages') {
      return <VisitorMessagesView onBack={() => setCurrentView('menu')} ownerPassword={unlockedPassword!} />;
    }

    if (currentView === 'contentEditor') {
      return <ContentEditor onBack={() => setCurrentView('menu')} ownerPassword={unlockedPassword!} />;
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-navy text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Owner Access Panel
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
