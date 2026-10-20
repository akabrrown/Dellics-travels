import { CarSearchCriteria, CarResult } from './car.types';

export interface ICarProvider {
  readonly name: string;
  search(criteria: CarSearchCriteria): Promise<CarResult[]>;
}
