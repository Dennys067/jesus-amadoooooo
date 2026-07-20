import React, { useState, useRef } from 'react';
import { Upload, Trash2, AlertCircle, RefreshCw, FileImage, Link2 } from 'lucide-react';
import { isSupabaseConfigured, uploadImage, deleteImage } from '../lib/supabase';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  folder: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'Insira a URL da imagem ou envie do dispositivo',
  folder,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate if image
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('O tamanho do arquivo deve ser inferior a 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      if (isSupabaseConfigured) {
        // Unique file path name in bucket
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const pathName = `${folder}/${sanitizedName}`;

        const publicUrl = await uploadImage(file, pathName);
        
        // If there was a previous custom image from Supabase, try to delete it
        if (value && value.includes('supabase.co/storage')) {
          try {
            await deleteImage(value);
          } catch (delErr) {
            console.warn('Could not delete old image:', delErr);
          }
        }

        onChange(publicUrl);
        setIsUploading(false);
      } else {
        // Fallback: Read file as Base64 to save directly in the DB
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          onChange(base64String);
          setIsUploading(false);
        };
        reader.onerror = () => {
          setError('Erro ao processar imagem do dispositivo.');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Erro ao fazer upload da imagem.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleRemove = async () => {
    if (isSupabaseConfigured && value && value.includes('supabase.co/storage')) {
      try {
        setIsUploading(true);
        await deleteImage(value);
      } catch (err) {
        console.error('Failed to delete image:', err);
      } finally {
        setIsUploading(false);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-2.5" id={`upload-field-container-${folder}`}>
      <div className="flex justify-between items-center">
        <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400">
          {label}
        </label>
        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold ${
          isSupabaseConfigured 
            ? 'bg-orange-500/10 text-orange-400' 
            : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {isSupabaseConfigured ? 'Supabase Storage' : 'Dispositivo (Base64)'}
        </span>
      </div>

      <div className="space-y-3">
        {/* Active Image Preview Card or Dropzone */}
        {value ? (
          <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/80 h-36 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded file preview"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-white rounded-xl transition-all border border-zinc-700 cursor-pointer"
                title="Substituir foto"
              >
                <RefreshCw className={`w-4 h-4 ${isUploading && 'animate-spin'}`} />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="p-2.5 bg-red-950/90 hover:bg-red-900 text-red-200 rounded-xl transition-all border border-red-900/50 cursor-pointer"
                title="Excluir foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 h-36 ${
              isDragOver
                ? 'border-orange-500 bg-orange-500/5'
                : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/60'
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                <p className="text-[11px] font-bold text-gray-300">
                  {isSupabaseConfigured ? 'Enviando para o Supabase...' : 'Processando imagem...'}
                </p>
              </>
            ) : (
              <>
                <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-850 text-gray-400 group-hover:text-white transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-300">
                    Arraste ou clique para enviar
                  </p>
                  <p className="text-[9px] text-gray-500 mt-1">
                    Formatos aceitos: PNG, JPG, JPEG, WEBP até 5MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Fallback Text Input with Link Icon */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2 relative">
            <div className="absolute left-3.5 top-3.5 text-gray-600">
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3.5 text-xs text-white focus:outline-none focus:border-orange-500 placeholder-gray-700"
            />
          </div>
          {!isSupabaseConfigured && (
            <p className="text-[9px] text-gray-500 px-1">
              A imagem será salva no próprio dispositivo. Para armazenamento em nuvem permanente, configure o Supabase.
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
