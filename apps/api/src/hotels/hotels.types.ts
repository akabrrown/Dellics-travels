export interface HotelRoomRate {
  matchHash: string;
  roomName: string;
  meal: string;
  price: number;
  currency: string;
  freeCancellationBefore?: string;
  beddingType?: string;
  amenities?: string[];
}

export interface HotelSearchInput {
  destination: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  rooms: number;
  adults?: number;
  children?: number;
}

export interface HotelResult {
  id: string;
  name: string;
  rating: number;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  description: string;
  rates?: HotelRoomRate[];
}
