import type { WordPressMedia } from '../types/vehicle';

const API_URL = import.meta.env.VITE_WORDPRESS_API_URL;

export async function getMedia(
  mediaId: number
): Promise<WordPressMedia | null> {
  if (!mediaId) {
    return null;
  }

  const response = await fetch(
    `${API_URL}/media/${mediaId}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch media ${mediaId}: ${response.status}`
    );
  }

  return response.json() as Promise<WordPressMedia>;
}