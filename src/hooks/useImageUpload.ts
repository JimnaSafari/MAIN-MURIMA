import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, getApiBaseUrl } from '@/services/api';

export const useImageUpload = (_bucket: string) => {
  const [uploading, setUploading] = useState(false);
  const { user, tokens } = useAuth();

  const uploadImage = async (file: File, _folder?: string): Promise<string | null> => {
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }
    if (!tokens?.access) {
      throw new Error('Missing access token for upload');
    }

    try {
      setUploading(true);
      const data = await apiClient.uploadImage(file, tokens.access);

      let url: string = data.image_url as string;
      if (!url) return null;

      // Normalize to absolute URL if backend returned relative (e.g., /media/...)
      if (url.startsWith('/')) {
        const backendOrigin = getApiBaseUrl().replace(/\/?api\/?$/, '');
        url = `${backendOrigin}${url}`;
      }
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (filePath: string) => {
    // Not implemented yet: backend delete endpoint can be added later
    console.warn('deleteImage is not implemented for Django storage yet.', filePath);
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
  };
};
