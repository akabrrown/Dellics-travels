import { create } from 'zustand';

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  dob: string;
  passport?: string;
}

interface BookingState {
  passenger: PassengerInfo | null;
  selectedSeat: string | null;
  selectedFareClass: 'economy' | 'premium' | 'business';
  
  setPassenger: (passenger: PassengerInfo) => void;
  setSelectedSeat: (seat: string | null) => void;
  setSelectedFareClass: (fare: 'economy' | 'premium' | 'business') => void;
  clearBookingData: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  passenger: null,
  selectedSeat: null,
  selectedFareClass: 'economy',

  setPassenger: (passenger) => set({ passenger }),
  setSelectedSeat: (selectedSeat) => set({ selectedSeat }),
  setSelectedFareClass: (selectedFareClass) => set({ selectedFareClass }),
  clearBookingData: () => set({ passenger: null, selectedSeat: null, selectedFareClass: 'economy' }),
}));
