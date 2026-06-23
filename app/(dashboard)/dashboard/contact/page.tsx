'use client';
import { useState } from 'react';
import { submitInquiry } from '@/app/actions/portal';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');
    try {
      await submitInquiry(new FormData(e.currentTarget));
      setSuccess(true);
    } catch {
      setError('Failed to send. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <CheckCircle size={48} className="text-green-600 mb-4" />
        <h2 className="text-xl font-bold text-brand-black">Message sent!</h2>
        <p className="text-sm text-brand-gray-400 mt-1">We&apos;ll get back to you as soon as possible.</p>
        <button onClick={() => setSuccess(false)}
          className="mt-5 text-sm text-brand-orange hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Contact the Academy</h1>
        <p className="text-sm text-brand-gray-400 mt-0.5">Send us a message and we&apos;ll respond shortly.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-brand-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Your name</label>
          <input name="name" required
            className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
            placeholder="Jane Smith" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Email (optional)</label>
          <input name="email" type="email"
            className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
            placeholder="you@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Phone (optional)</label>
          <input name="phone"
            className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
            placeholder="+1 403 000 0000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-black mb-1.5">Message</label>
          <textarea name="message" required rows={4}
            className="w-full border border-brand-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none"
            placeholder="Your question or message…" />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">{error}</p>
        )}

        <button type="submit" disabled={pending}
          className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-2">
          {pending && <Loader2 size={16} className="animate-spin" />}
          {pending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
