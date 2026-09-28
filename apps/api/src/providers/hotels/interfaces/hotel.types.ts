export interface HotelSearchCriteria {
  destination: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guests: {
    adults: number;
    children?: number;
    childrenAges?: number[];
  }[]; // Array of rooms with guests
  currency?: string;
  language?: string;
}

export interface NormalizedHotel {
  hotelId: string; // Supplier specific ID
  provider: string; // e.g., 'ratehawk', 'hotelbeds'
  name: string;
  location: {
    address: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  images: string[];
  rating: number;
  description: string;
  amenities: string[];
}

export interface NormalizedRoomRate {
  rateId: string; // Supplier specific rate ID
  roomName: string;
  boardType: string; // e.g., 'Room Only', 'Bed and Breakfast', 'Half Board'
  price: number; // Raw price from supplier
  currency: string;
  cancellationPolicy: {
    isRefundable: boolean;
    freeCancellationUntil?: string; // ISO DateTime
    penalties?: {
      amount: number;
      from: string; // ISO DateTime
    }[];
  };
  supplier: string;
}

export interface NormalizedHotelWithRates extends NormalizedHotel {
  rates: NormalizedRoomRate[];
}

export interface HotelBookingRequest {
  rateId: string;
  guests: {
    title: string;
    firstName: string;
    lastName: string;
    isChild: boolean;
    age?: number;
  }[];
  contactDetails: {
    email: string;
    phone: string;
  };
  paymentMethod?: any; // To be expanded based on supplier reqs
}

export interface HotelBookingResponse {
  success: boolean;
  bookingId?: string; // Supplier's booking reference
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  totalPrice?: number;
  currency?: string;
  error?: string;
}
