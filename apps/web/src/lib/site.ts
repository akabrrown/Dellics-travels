export function sanitizeApiUrl(url: string | undefined): string {
  if (!url) return "http://localhost:3000";
  return url
    .trim()
    .replace(/\\r|\\n|\\t/gi, "")
    .replace(/[\r\n\t\v\f]+/g, "")
    .replace(/[\/\\]+n(?=[\/\\]|$)/gi, "")
    .replace(/[\/\\]+$/, "");
}

export const SITE = {
  name: "Dellics Travels",
  legalName: "Dellics Travels",
  whatsappNumber: "233552054174",
  phone: "+233552054174",
  phoneDisplay: "+233 55 205 4174",
  email: "help@dellicstravels.com",
  offices: {
    us: {
      entity: "Dellics Travels",
      address: "30 N Gould ST, STER, SHERIDAN, WYOMING, 82801",
      country: "United States",
      email: "help@dellicstravels.com",
    },
    ghana: {
      entity: "Dellics Travels",
      address: "GN-0490-2450, Tema, Greater Accra",
      region: "Greater Accra",
      country: "Ghana",
      phone: "+233552054174",
      phoneDisplay: "+233 55 205 4174",
      email: "help@dellicstravels.com",
    },
  },
  address: "GN-0490-2450, Tema, Greater Accra, Ghana",
  usAddress: "30 N Gould ST, STER, SHERIDAN, WYOMING, 82801, United States",
  travelUrl: "https://mytravel.io/dellicstravels",
};

export const API_URL = sanitizeApiUrl(process.env.NEXT_PUBLIC_API_URL);
