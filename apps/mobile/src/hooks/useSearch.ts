import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useSearchFlights(params: any) {
  return useQuery({
    queryKey: ['flights', params],
    queryFn: async () => {
      const response = await api.get('/search/flights', { params });
      return response.data;
    },
  });
}

export function useSearchHotels(params: any) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: async () => {
      const response = await api.get('/search/hotels', { params });
      return response.data;
    },
  });
}
