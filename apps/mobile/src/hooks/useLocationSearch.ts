import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface Place {
  id: string;
  name: string;
  iataCode: string;
  type: string;
  cityName: string;
  countryName: string;
}

export function useLocationSearch(query: string, type: string = 'flight') {
  return useQuery({
    queryKey: ['places', query, type],
    queryFn: async (): Promise<Place[]> => {
      if (!query || query.length < 2) return [];
      
      const res = await fetch(`${API_URL}/search/places?q=${encodeURIComponent(query)}&type=${type}`).catch(() => null);
      
      if (!res || !res.ok) {
        return [];
      }
      
      const json = await res.json();
      return json.data || [];
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
