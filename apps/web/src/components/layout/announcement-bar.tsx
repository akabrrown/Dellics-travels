import { SITE } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-orange text-white text-center text-sm py-2 px-4">
      IATA-accredited · 24/7 support — call {SITE.phoneDisplay} or WhatsApp us anytime
    </div>
  );
}
