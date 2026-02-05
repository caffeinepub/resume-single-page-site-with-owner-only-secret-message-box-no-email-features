import { useState } from 'react';
import { useSubmitVisitorMessage } from '../hooks/useVisitorMessages';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import Section from './Section';

export default function VisitorMessageForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitMessage = useSubmitVisitorMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }

    try {
      await submitMessage.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit message:', error);
    }
  };

  return (
    <Section id="contact" title="Learn More">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gold/30 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-navy" />
            <p className="text-gray-600">
              Interested in learning more? Leave your details and I'll get back to you.
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800 font-medium">
                Thank you for your message! I'll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent resize-none"
                  placeholder="Tell me about your interest..."
                />
              </div>
              <button
                type="submit"
                disabled={submitMessage.isPending || !name.trim() || !email.trim() || !message.trim()}
                className="w-full bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitMessage.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
