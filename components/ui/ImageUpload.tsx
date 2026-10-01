"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
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
  const [uploadError, setUploadError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      if (data.secure_url) {
        onChange(data.secure_url);
      } else if (data.url) {
        onChange(data.url);
      } else {
        throw new Error("The upload provider did not return an image URL");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <input
          type="url"
          value={value}
          onChange={(event) => {
            setUploadError("");
            onChange(event.target.value);
          }}
          placeholder="https://example.com/image.jpg"
          aria-label="Hosted image URL"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-neutral-500">
          Paste a hosted image URL, or use the optional Cloudinary uploader below.
        </p>
      </div>
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
                  <p className="text-xs text-gray-500">Upload with Cloudinary</p>
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
      {uploadError && (
        <p role="alert" className="text-sm text-amber-400">
          {uploadError}
        </p>
      )}
    </div>
  );
}
