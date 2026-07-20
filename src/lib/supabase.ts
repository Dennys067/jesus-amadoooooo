/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Initialize Supabase client lazily or fallback to null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads a file to Supabase Storage in the 'arena-prime' bucket.
 * @param file The file object to upload.
 * @param pathName The destination path/filename in the bucket (e.g. 'logos/my-logo.png' or 'gallery/image.jpg').
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(file: File, pathName: string): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase integration is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const bucketName = 'arena-prime';

  // Sanitize file name and prepend timestamp to prevent caching / overwrite issues
  const cleanFileName = `${Date.now()}_${pathName.replace(/[^a-zA-Z0-9./_-]/g, '')}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(cleanFileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(cleanFileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to retrieve the public URL from Supabase Storage.');
  }

  return publicUrlData.publicUrl;
}

/**
 * Deletes an image from Supabase Storage based on its public URL.
 * @param publicUrl The public URL of the image to delete.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  if (!supabase) return;

  const bucketName = 'arena-prime';

  try {
    // A typical Supabase storage URL looks like:
    // https://[project-id].supabase.co/storage/v1/object/public/arena-prime/1712345678_gallery/image.jpg
    // We need to extract '1712345678_gallery/image.jpg' from it.
    const urlPattern = `/storage/v1/object/public/${bucketName}/`;
    const urlIndex = publicUrl.indexOf(urlPattern);

    if (urlIndex === -1) {
      console.warn('The image URL does not match the standard Supabase public storage format. Skipping deletion.');
      return;
    }

    const filePath = publicUrl.substring(urlIndex + urlPattern.length);
    if (!filePath) return;

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`Failed to delete file from Supabase Storage at path: ${filePath}`, error);
    } else {
      console.log(`Successfully deleted file from Supabase Storage: ${filePath}`);
    }
  } catch (err) {
    console.error('Error during Supabase file deletion:', err);
  }
}
