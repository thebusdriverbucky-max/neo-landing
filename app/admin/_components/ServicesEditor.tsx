'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface ServicesEditorProps {
  initialData: any;
}

export default function ServicesEditor({ initialData }: ServicesEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'services', data }),
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

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { title: '', description: '', icon: '⭐' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    setData({ ...data, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  return (
    <section id="services" className="p-4 md:p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Services Section</h2>

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-neutral-400">Service List</label>
            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="grid gap-4">
            {data.items.map((item: any, index: number) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                <div className="flex-1 grid gap-2 w-full">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Icon"
                      className="w-16 sm:w-20 px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
                      value={item.icon}
                      onChange={(e) => updateItem(index, 'icon', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Service Title"
                      className="flex-1 px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm"
                      value={item.title}
                      onChange={(e) => updateItem(index, 'title', e.target.value)}
                    />
                  </div>
                  <textarea
                    placeholder="Service Description"
                    className="w-full px-3 py-1.5 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm h-20"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeItem(index)}
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
