import { create } from 'zustand';

interface SearchState {
  dates: string;
  checkInDate: string;
  checkOutDate: string;
  startDateIso: string | null;
  endDateIso: string | null;
  travelers: string;
  cabinClass: string;
  roomsAndGuests: string;
  locations: Record<string, string>;
  
  setDates: (dates: string) => void;
  setCheckInDate: (dateStr: string, isoStr?: string) => void;
  setCheckOutDate: (dateStr: string, isoStr?: string) => void;
  setRangeDates: (checkIn: string, checkOut: string, startIso?: string, endIso?: string) => void;
  
  setTravelers: (travelers: string) => void;
  setCabinClass: (cabinClass: string) => void;
  setRoomsAndGuests: (roomsAndGuests: string) => void;
  setLocation: (field: string, location: string) => void;
  recentSearches: any[];
  addRecentSearch: (place: any) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  dates: 'Select Dates',
  checkInDate: 'Select',
  checkOutDate: 'Select',
  startDateIso: null,
  endDateIso: null,
  travelers: '1 Adult',
  cabinClass: 'Economy',
  roomsAndGuests: '1 Room, 2 Guests',
  locations: {
    flightOrigin: '',
    flightDestination: '',
    hotelDestination: '',
    carOrigin: '',
    carDestination: '',
    genericDestination: '',
  },

  setDates: (dates) => set({ dates }),

  setCheckInDate: (dateStr, isoStr) => set((state) => {
    const combined = state.checkOutDate !== 'Select' ? `${dateStr} - ${state.checkOutDate}` : dateStr;
    return {
      checkInDate: dateStr,
      dates: combined,
      startDateIso: isoStr || state.startDateIso,
    };
  }),

  setCheckOutDate: (dateStr, isoStr) => set((state) => {
    const combined = state.checkInDate !== 'Select' ? `${state.checkInDate} - ${dateStr}` : dateStr;
    return {
      checkOutDate: dateStr,
      dates: combined,
      endDateIso: isoStr || state.endDateIso,
    };
  }),

  setRangeDates: (checkIn, checkOut, startIso, endIso) => set({
    checkInDate: checkIn,
    checkOutDate: checkOut,
    dates: checkOut ? `${checkIn} - ${checkOut}` : checkIn,
    startDateIso: startIso || null,
    endDateIso: endIso || null,
  }),

  setTravelers: (travelers) => set({ travelers }),
  setCabinClass: (cabinClass) => set({ cabinClass }),
  setRoomsAndGuests: (roomsAndGuests) => set({ roomsAndGuests }),
  setLocation: (field, location) => set((state) => ({ 
    locations: { ...state.locations, [field]: location } 
  })),
  recentSearches: [],
  addRecentSearch: (place) => set((state) => {
    const filtered = state.recentSearches.filter(p => p.id !== place.id);
    return { recentSearches: [place, ...filtered].slice(0, 5) };
  }),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
