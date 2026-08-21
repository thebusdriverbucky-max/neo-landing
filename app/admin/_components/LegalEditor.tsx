'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { SiteContentData } from '@/lib/content';

interface LegalEditorProps {
  initialData: SiteContentData['legal'];
}

export default function LegalEditor({ initialData }: LegalEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'legal', data }),
      });
      if (res.ok) {
        alert('Saved!');
      } else {
        alert('Error saving');
      }
    } catch {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="legal" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Legal Pages</h2>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Privacy Policy</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-48"
            value={data.privacyPolicy}
            onChange={(e) => setData({ ...data, privacyPolicy: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Terms of Service</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-48"
            value={data.termsOfService}
            onChange={(e) => setData({ ...data, termsOfService: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Cookie Policy</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-48"
            value={data.cookiePolicy}
            onChange={(e) => setData({ ...data, cookiePolicy: e.target.value })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
