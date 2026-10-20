import {
  HotelSearchCriteria,
  NormalizedHotelWithRates,
  HotelBookingRequest,
  HotelBookingResponse,
  NormalizedHotel,
} from './hotel.types';

export interface IHotelProvider {
  /**
   * The name of the provider (e.g., 'ratehawk', 'hotelbeds')
   */
  readonly name: string;

  /**
   * Search for hotels based on criteria
   */
  search(criteria: HotelSearchCriteria): Promise<NormalizedHotelWithRates[]>;

  /**
   * Pre-book / verify rate before finalizing booking
   */
  verifyRate(rateId: string): Promise<boolean>;

  /**
   * Book a hotel rate
   */
  book(request: HotelBookingRequest): Promise<HotelBookingResponse>;

  /**
   * Get static content for a list of hotel IDs
   */
  getHotelDetails(hotelIds: string[]): Promise<NormalizedHotel[]>;
}
