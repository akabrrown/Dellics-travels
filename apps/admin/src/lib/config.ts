const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const cleanApiUrl = rawApiUrl.trim().replace(/[\r\n\t]+/g, "").replace(/\/+$/, "");

const rawWebUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3001";
const cleanWebUrl = rawWebUrl.trim().replace(/[\r\n\t]+/g, "").replace(/\/+$/, "");

export const ADMIN_CONFIG = {
  appName: "Dellics Travels Admin Portal",
  apiUrl: cleanApiUrl,
  webUrl: cleanWebUrl,
  supportEmail: "info@dellicstravels.com",
  phone: "+233 55 205 4174",
  iataStatus: "IATA Certified",
  defaultRefundLimitGHS: 500,
};
