export const SITE = {
  name: "Dellics Travels",
  legalName: "Dellics Travels LLC / Dellics Travels & Tours",
  whatsappNumber: "233552054174",
  phone: "+233552054174",
  phoneDisplay: "+233 55 205 4174",
  email: "info@dellicstravels.com",
  offices: {
    us: {
      entity: "Dellics Travels LLC",
      address: "30 N Gould ST, STER, SHERIDAN, WYOMING, 82801",
      country: "United States",
      email: "info@dellicstravels.com",
    },
    ghana: {
      entity: "Dellics Travels",
      address: "Community 25, Devtraco Estate, Tema",
      region: "Greater Accra",
      country: "Ghana",
      phone: "+233552054174",
      phoneDisplay: "+233 55 205 4174",
      email: "info@dellicstravels.com",
    },
  },
  address: "Community 25, Devtraco Estate Tema, Greater Accra, Ghana",
  usAddress: "30 N Gould ST, STER, SHERIDAN, WYOMING, 82801, United States",
  travelUrl: "https://mytravel.io/dellicstravels",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
