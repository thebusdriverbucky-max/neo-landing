'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

interface MetaEditorProps {
  initialData: any;
}

export default function MetaEditor({ initialData }: MetaEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'meta', data }),
      });
      if (res.ok) {
        alert('Saved!');
      } else {
        alert('Error saving');
      }
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="meta" className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">General Settings (Meta)</h2>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Site Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.siteName}
            onChange={(e) => setData({ ...data, siteName: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Site Description</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-24"
            value={data.siteDescription}
            onChange={(e) => setData({ ...data, siteDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Favicon URL</label>
          <ImageUpload
            value={data.favicon}
            onChange={(url) => setData({ ...data, favicon: url })}
            onRemove={() => setData({ ...data, favicon: '' })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
