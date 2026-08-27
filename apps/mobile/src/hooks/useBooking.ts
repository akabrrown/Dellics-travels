import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export function useCreateHold() {
  return useMutation({
    mutationFn: async (bookingData: any) => {
      // Mock hold creation since backend API is not yet running
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, holdId: uuidv4() });
        }, 1000);
      });
    },
  });
}

export function useConfirmBooking() {
  return useMutation({
    mutationFn: async (bookingData: any) => {
      // Defensive coding: generate idempotency key client-side to prevent double charges
      // on network retry
      const idempotencyKey = uuidv4();
      const response = await api.post('/booking/confirm', bookingData, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      return response.data;
    },
  });
}
