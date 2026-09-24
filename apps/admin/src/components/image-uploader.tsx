"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImageUploader({ value, onChange, placeholder, className = "" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    // Quick validation
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-sm"
              title="Change Image"
            >
              <UploadCloud className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative w-full border-2 border-dashed rounded-xl transition-colors ${dragActive ? "border-brand-blue bg-brand-blue/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center cursor-pointer" onClick={() => inputRef.current?.click()}>
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-brand-blue animate-spin mb-3" />
            ) : (
              <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
            )}
            <p className="text-sm font-bold text-slate-700 mb-1">
              {isUploading ? "Uploading..." : "Click or drag image to upload"}
            </p>
            <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
          </div>
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
