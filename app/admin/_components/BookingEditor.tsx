'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface BookingEditorProps {
  initialData: any;
}

export default function BookingEditor({ initialData }: BookingEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'booking', data }),
      });
      alert('Saved!');
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Booking Section</h2>

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

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showDateField"
            className="w-5 h-5 rounded border-neutral-700 bg-neutral-800 text-primary focus:ring-primary"
            checked={data.showDateField}
            onChange={(e) => setData({ ...data, showDateField: e.target.checked })}
          />
          <label htmlFor="showDateField" className="text-sm font-medium text-neutral-400">
            Show date selection field
          </label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
