'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';

interface HeroEditorProps {
  initialData: any;
}

export default function HeroEditor({ initialData }: HeroEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'hero', data }),
      });
      alert('Saved!');
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero" className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Hero Section</h2>
      
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Subtitle</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Button Text</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={data.buttonText}
            onChange={(e) => setData({ ...data, buttonText: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Background Image</label>
          <ImageUpload
            value={data.backgroundImage}
            onChange={(url) => setData({ ...data, backgroundImage: url })}
            onRemove={() => setData({ ...data, backgroundImage: '' })}
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
