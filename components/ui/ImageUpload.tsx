"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-full max-w-[160px] aspect-square rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800">
            <Image
              fill
              src={value}
              alt="Upload"
              className="object-cover"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition z-10"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="w-full max-w-[160px] aspect-square flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-primary transition bg-neutral-800/50">
            <div className="flex flex-col items-center justify-center p-4 text-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Click to upload</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
              accept="image/*"
            />
          </label>
        )}
      </div>
    </div>
  );
}
