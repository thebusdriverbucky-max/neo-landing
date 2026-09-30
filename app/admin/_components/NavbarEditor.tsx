'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import type { SiteContentData } from '@/lib/content';

interface NavbarEditorProps {
  initialData: SiteContentData['navbar'];
}

export default function NavbarEditor({ initialData }: NavbarEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'navbar', data }),
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

  const updateLink = (index: number, value: string) => {
    const links = [...data.links];
    links[index] = value;
    setData({ ...data, links });
  };

  const addLink = () => {
    setData({ ...data, links: [...data.links, ''] });
  };

  const removeLink = (index: number) => {
    setData({
      ...data,
      links: data.links.filter((_, linkIndex) => linkIndex !== index),
    });
  };

  return (
    <section id="navbar" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Navigation</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-400">Navigation Links</label>
          <button
            type="button"
            onClick={addLink}
            className="text-sm text-primary hover:text-primary/80 transition"
          >
            Add link
          </button>
        </div>

        <div className="grid gap-3">
          {data.links.map((link, index) => (
            <div key={`${index}-${link}`} className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder="Section name"
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="px-3 text-red-400 hover:text-red-300 transition"
                aria-label={`Remove navigation link ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
