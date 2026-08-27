export const CITY_NAMES: Record<string, string> = {
  ACC: 'Accra',
  LHR: 'London (Heathrow)',
  LGW: 'London (Gatwick)',
  STN: 'London (Stansted)',
  DXB: 'Dubai',
  CDG: 'Paris (Charles de Gaulle)',
  ORY: 'Paris (Orly)',
  JFK: 'New York (JFK)',
  EWR: 'New York (Newark)',
  LGA: 'New York (LaGuardia)',
  AMS: 'Amsterdam',
  FRA: 'Frankfurt',
  IST: 'Istanbul',
  DOH: 'Doha',
  ADD: 'Addis Ababa',
  LOS: 'Lagos',
  ABJ: 'Abidjan',
  NBO: 'Nairobi',
  JNB: 'Johannesburg',
  CPT: 'Cape Town',
  SIN: 'Singapore',
  BKK: 'Bangkok',
  HND: 'Tokyo (Haneda)',
  NRT: 'Tokyo (Narita)',
  SYD: 'Sydney',
  YYZ: 'Toronto',
  YVR: 'Vancouver',
  MAD: 'Madrid',
  BCN: 'Barcelona',
  FCO: 'Rome (Fiumicino)',
  ZRH: 'Zurich',
};

export function formatCityName(code: string): string {
  if (!code) return 'City';
  const cleanCode = code.trim().toUpperCase();
  return CITY_NAMES[cleanCode] || cleanCode;
}
