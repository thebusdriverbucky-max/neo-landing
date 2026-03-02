'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { Plus, Trash2 } from 'lucide-react';

interface GalleryEditorProps {
  initialData: any;
}

export default function GalleryEditor({ initialData }: GalleryEditorProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'gallery', data }),
      });
      alert('Saved!');
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  const addImage = (url: string) => {
    setData({
      ...data,
      images: [...data.images, url]
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    setData({ ...data, images: newImages });
  };

  return (
    <section id="gallery" className="p-8 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-6">
      <h2 className="text-2xl font-bold">Gallery Section</h2>
      
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
          <label className="block text-sm font-medium text-neutral-400">Images</label>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.images.map((url: string, index: number) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="aspect-square">
              <ImageUpload
                value=""
                onChange={(url) => addImage(url)}
                onRemove={() => {}}
              />
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </section>
  );
}
