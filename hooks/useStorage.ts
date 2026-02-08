import { useState, useRef } from 'react';
import { supabase } from '../src/supabase';

export const useStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Resize and compress image before upload
    const optimizeImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context failure'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Canvas to Blob failure'));
                    }, 'image/jpeg', quality);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const uploadImage = async (file: File, bucket: string = 'products', folder: string = ''): Promise<string> => {
        setUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // 1. Optimize
            console.log('Optimizing image...');
            let optimizedBlob: Blob | File = file;

            try {
                setUploadProgress(25);
                optimizedBlob = await optimizeImage(file);
                console.log('Optimization success.');
            } catch (optErr) {
                console.warn('Optimization failed, falling back to original file:', optErr);
                // Fallback to original
                optimizedBlob = file;
            }

            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const filePath = folder ? `${folder}/${fileName}` : fileName;

            console.log(`Uploading to ${bucket}/${filePath} (Size: ${(optimizedBlob.size / 1024).toFixed(2)} KB)`);

            setUploadProgress(50);

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, optimizedBlob, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            setUploadProgress(75);

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setUploadProgress(100);
            return data.publicUrl;
        } catch (err: any) {
            console.error('Upload Error:', err);
            setError(err.message);
            throw err;
        } finally {
            setUploading(false);
            setUploadProgress(null);
        }
    };

    return {
        uploadImage,
        uploading,
        uploadProgress,
        error
    };
};
