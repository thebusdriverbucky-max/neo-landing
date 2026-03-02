'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { Plus, Trash2 } from 'lucide-react';

interface AboutEditorProps {
  initialData: any;
}

export default function AboutEditor({ initialData }: AboutEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'about', data }),
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

  const addStat = () => {
    setData({
      ...data,
      stats: [...data.stats, { value: '', label: '' }]
    });
  };

  const removeStat = (index: number) => {
    const newStats = [...data.stats];
    newStats.splice(index, 1);
    setData({ ...data, stats: newStats });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  return (
    <section id="about" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">About Us Section</h2>

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
          <label className="block text-sm font-medium text-neutral-400 mb-2">Text</label>
          <textarea
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary h-32"
            value={data.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Image</label>
          <ImageUpload
            value={data.image}
            onChange={(url) => setData({ ...data, image: url })}
            onRemove={() => setData({ ...data, image: '' })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-400">Statistics</label>
            <button
              onClick={addStat}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="grid gap-4">
            {data.stats.map((stat: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                <div className="flex-1 grid gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Value (e.g. 10+)"
                    className="w-full px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Years Experience)"
                    className="w-full px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeStat(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition self-end sm:self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
