import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storage = getStorage();

  // Resize image before upload (max 1200px width)
  const resizeImage = (file: File, maxWidth: number = 1200): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to blob conversion failed'));
            }
          }, 'image/jpeg', 0.85);
        };
        img.onerror = () => reject(new Error('Image failed to load'));
      };
      reader.onerror = () => reject(new Error('File read failed'));
    });
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    setUploading(true);
    setError(null);
    
    try {
      // Resize image before upload
      const resizedBlob = await resizeImage(file);
      const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' });
      
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, `${path}/${filename}`);
      
      // Upload to Firebase Storage
      await uploadBytes(storageRef, resizedFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      setUploading(false);
      return downloadURL;
    } catch (err: any) {
      const errorMsg = err.message || 'Image upload failed';
      setError(errorMsg);
      setUploading(false);
      throw new Error(errorMsg);
    }
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      // Extract path from download URL
      const decodedUrl = decodeURIComponent(imageUrl);
      const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);
      
      if (pathMatch && pathMatch[1]) {
        const filePath = pathMatch[1].replace('%2F', '/');
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }
    } catch (err: any) {
      console.error('Delete image error:', err);
      // Don't throw - deletion failures shouldn't block app flow
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
  };
};
