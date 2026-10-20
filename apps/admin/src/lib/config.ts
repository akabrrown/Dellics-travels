export function sanitizeApiUrl(url: string | undefined): string {
  if (!url) return "http://localhost:3000";
  return url
    .trim()
    .replace(/\\r|\\n|\\t/gi, "")
    .replace(/[\r\n\t\v\f]+/g, "")
    .replace(/[\/\\]+n(?=[\/\\]|$)/gi, "")
    .replace(/[\/\\]+$/, "");
}

export function sanitizeWebUrl(url: string | undefined): string {
  if (!url) return "http://localhost:3001";
  return url
    .trim()
    .replace(/\\r|\\n|\\t/gi, "")
    .replace(/[\r\n\t\v\f]+/g, "")
    .replace(/[\/\\]+$/, "");
}

export const ADMIN_CONFIG = {
  appName: "Dellics Travels Admin Portal",
  apiUrl: sanitizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  webUrl: sanitizeWebUrl(process.env.NEXT_PUBLIC_WEB_URL),
  supportEmail: "help@dellicstravels.com",
  phone: "+233 55 205 4174",
  iataStatus: "IATA Accredited",
  defaultRefundLimitGHS: 500,
};
