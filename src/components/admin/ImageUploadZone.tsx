"use client";
import { useState, useRef } from "react";
import { UploadCloud, X, Loader2, AlertCircle, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadZoneProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploadZone({ images, onChange }: ImageUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data.url;
  };

  const handleFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please drop or select image files only.");
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      setUploadProgress(`Uploading ${i + 1}/${validFiles.length}: ${file.name}`);
      try {
        const url = await uploadFile(file);
        newUrls.push(url);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || `Failed to upload ${file.name}`);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      toast.success(`Successfully uploaded ${newUrls.length} image(s) to Cloudinary`);
    }

    setUploading(false);
    setUploadProgress("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (idxToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== idxToRemove));
    toast.success("Image reference removed");
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    onChange([...images, manualUrl.trim()]);
    setManualUrl("");
    setShowManualInput(false);
    toast.success("External image URL added");
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={uploading ? undefined : triggerFileInput}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${
          isDragActive
            ? "border-amber-400 bg-purple-500/10 scale-[0.99]"
            : "border-purple-500/25 bg-purple-500/5 hover:border-purple-500/50 hover:bg-purple-500/10"
        } ${uploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-xs font-bold text-amber-400">{uploadProgress}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              Transmitting to Cloudinary servers...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Drag & drop product images here
              </p>
              <p className="text-[10px] mt-1" style={{ color: "var(--text-secondary)" }}>
                or <span className="text-amber-400 font-bold underline">browse files</span> from your computer
              </p>
            </div>
            <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              Supports PNG, JPG, JPEG, WEBP
            </p>
          </div>
        )}
      </div>

      {/* Manual URL entry toggle */}
      <div className="flex justify-between items-center text-[10px]">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="flex items-center gap-1 text-purple-300 hover:text-white"
        >
          <LinkIcon size={10} />
          {showManualInput ? "Hide paste URL option" : "Paste external image URL"}
        </button>
      </div>

      {showManualInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="input text-xs py-2 flex-1"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-purple-300 text-[10px] font-bold rounded-xl"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-300/60">
            Image Gallery ({images.length})
          </p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/20 bg-purple-950/20 group"
              >
                {url ? (
                  <>
                    <Image
                      src={url}
                      alt={`Product Preview ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-amber-400 text-black font-black text-[8px] px-1 py-0.5 rounded shadow">
                        PRIMARY
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X size={10} />
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400/40 p-2 text-center">
                    <AlertCircle size={14} />
                    <span className="text-[8px] mt-1">Empty URL</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
