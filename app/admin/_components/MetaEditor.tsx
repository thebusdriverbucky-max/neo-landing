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
    <section id="meta" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">SEO & General Settings</h2>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Site Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.siteName || ''}
            onChange={(e) => setData({ ...data, siteName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Navigation Logo (Text)</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={data.logoText || ''}
              onChange={(e) => setData({ ...data, logoText: e.target.value })}
              placeholder="LOGO"
            />
            <p className="text-xs text-neutral-500 mt-1">Used if no image is uploaded</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Navigation Logo (Image)</label>
            <ImageUpload
              value={data.logoImageUrl || ''}
              onChange={(url) => setData({ ...data, logoImageUrl: url })}
              onRemove={() => setData({ ...data, logoImageUrl: '' })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Site Description</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-24"
            value={data.siteDescription || ''}
            onChange={(e) => setData({ ...data, siteDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Site URL</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.siteUrl || ''}
            onChange={(e) => setData({ ...data, siteUrl: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Language (e.g., en, ru)</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.siteLang || ''}
            onChange={(e) => setData({ ...data, siteLang: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Favicon</label>
          <ImageUpload
            value={data.faviconUrl || ''}
            onChange={(url) => setData({ ...data, faviconUrl: url })}
            onRemove={() => setData({ ...data, faviconUrl: '' })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">OG Image (Social Share)</label>
          <ImageUpload
            value={data.ogImageUrl || ''}
            onChange={(url) => setData({ ...data, ogImageUrl: url })}
            onRemove={() => setData({ ...data, ogImageUrl: '' })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Copyright Text</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.copyright || ''}
            onChange={(e) => setData({ ...data, copyright: e.target.value })}
            placeholder="© 2025 Business Name. All rights reserved."
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
