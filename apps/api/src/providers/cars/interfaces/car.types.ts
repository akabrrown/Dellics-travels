export interface CarSearchCriteria {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string; // ISO String
  dropoffDateTime: string; // ISO String
  currency?: string;
}

export interface CarResult {
  id: string;
  provider: string;
  vendorName: string;
  vehicle: {
    name: string;
    category: string;
    transmission: string;
    seats: number;
    doors: number;
    airConditioning: boolean;
    image: string;
  };
  price: number;
  currency: string;
  pickupLocation: string;
  dropoffLocation: string;
}
