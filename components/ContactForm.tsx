'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      website: String(formData.get('website') ?? ''),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setStatus('success');
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-border bg-surface p-8">
        <div className="text-xs uppercase tracking-widest text-success font-mono mb-2">
          Sent
        </div>
        <h2 className="font-heading text-xl font-bold tracking-tight mb-2">
          Got it. I will reply soon.
        </h2>
        <p className="text-foreground-muted">
          Your message landed in my inbox. Most replies go out within a couple of days.
        </p>
      </div>
    );
  }

  const fieldCls =
    'w-full px-4 py-3 bg-surface border border-border rounded-md text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-px h-px"
        aria-hidden="true"
      />
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-foreground-muted font-mono mb-2">
            Name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldCls}
            placeholder="Jane Doe"
          />
        </label>
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-foreground-muted font-mono mb-2">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
            placeholder="jane@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="block text-xs uppercase tracking-widest text-foreground-muted font-mono mb-2">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={5000}
          className={`${fieldCls} resize-y`}
          placeholder="What are you building?"
        />
      </label>
      {error && (
        <div className="rounded-md border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Send size={14} strokeWidth={2.5} />
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>
        <span className="text-xs text-foreground-muted">
          No marketing. Direct to my inbox.
        </span>
      </div>
    </form>
  );
}
