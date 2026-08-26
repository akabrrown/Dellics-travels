export interface HotelSearchInput {
  destination: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  rooms: number;
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
}
