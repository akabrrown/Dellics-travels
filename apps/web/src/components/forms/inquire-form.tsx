"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/api";
import { inquireSchema } from "@/lib/schemas";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function InquireForm() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("");
  const [message, setMessage] = useState("");
  const [contextBanner, setContextBanner] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (user.fullName) setName((prev) => prev || user.fullName);
      if (user.email) setEmail((prev) => prev || user.email);
      if (user.phone) setPhone((prev) => prev || user.phone || "");
    }
  }, [user]);


  useEffect(() => {
    const service = searchParams.get("service");

    const tour = searchParams.get("tour");
    const hotel = searchParams.get("hotel");
    const vehicle = searchParams.get("vehicle");
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const pkg = searchParams.get("package");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const price = searchParams.get("price");
    const date = searchParams.get("date") || searchParams.get("departDate");
    const travelerCount = searchParams.get("travelers") || searchParams.get("passengers");

    if (date) setTravelDate(date);
    if (travelerCount) setTravelers(travelerCount);

    if (service === "flights" && (from || to)) {
      setDestination(`${to || "Flight"} from ${from || "Accra"}`);
      setMessage(`Hello Dellics Travels, I would like to request a flight quote for: ${from || "Accra"} to ${to || "Destination"}.`);
      setContextBanner(`Flight Inquiry: ${from || "Accra"} → ${to || "Destination"}`);
    } else if (service === "hotels" && hotel) {
      const loc = searchParams.get("location") || "";
      setDestination(`${hotel}${loc ? ` (${loc})` : ""}`);
      setMessage(`Hello Dellics Travels, I am interested in reserving accommodation at ${hotel}${loc ? ` in ${loc}` : ""}${price ? ` (${price})` : ""}. Please confirm availability and room options.`);
      setContextBanner(`Hotel Reservation: ${hotel}`);
    } else if (service === "tours" && (tour || pkg)) {
      const tourName = tour || pkg || "Tour Package";
      const dest = searchParams.get("destination") || "";
      setDestination(`${tourName}${dest ? ` (${dest})` : ""}`);
      setMessage(`Hello Dellics Travels, I would like to book or inquire about the ${tourName} package${dest ? ` (${dest})` : ""}${price ? ` (${price})` : ""}. Please send full itinerary details.`);
      setContextBanner(`Tour Package: ${tourName}`);
    } else if (service === "transfers" && vehicle) {
      const cap = searchParams.get("capacity") || "";
      setDestination(`VIP Transfer (${vehicle})`);
      setMessage(`Hello Dellics Travels, I need a VIP Airport/Hotel transfer quote with vehicle: ${vehicle}${cap ? ` (Capacity: ${cap})` : ""}.`);
      setContextBanner(`Vehicle Transfer: ${vehicle}`);
    } else if (service === "car_hire") {
      const city = searchParams.get("city") || "";
      const veh = searchParams.get("vehicle") || "";
      const driver = searchParams.get("driver") || "";
      const duration = searchParams.get("duration") || "";
      setDestination(`Car Rental (${city || "Ghana"})`);
      setMessage(`Hello Dellics Travels, I would like to hire an executive car:
• Location: ${city || "Accra"}
• Vehicle: ${veh || "Luxury SUV"}
• Mode: ${driver || "With Chauffeur"}
• Duration: ${duration || "3 Days"}`);
      setContextBanner(`Executive Car Hire: ${veh || "Luxury Fleet"}`);
    } else if (service === "visa" && country) {
      setDestination(`${country} (${category || "Visa Consultation"})`);
      setMessage(`Hello Dellics Travels, I need consular advisory and visa processing assistance for ${country} (${category || "Tourist / Business Visa"}). Please share requirements and document checklist.`);
      setContextBanner(`Visa Advisory: ${country}`);
    } else if (service === "corporate") {
      setDestination("Corporate Travel Account");
      setMessage("Hello Dellics Travels, our organization would like to explore opening a Corporate Travel Management account for corporate flight bookings, executive hotel reservations, and staff travel ledgers.");
      setContextBanner("Corporate Travel Management Account");
    } else if (service === "diaspora" && pkg) {
      setDestination(pkg);
      setMessage(`Hello Dellics Travels, I am interested in the ${pkg} heritage pilgrimage. Please share dates, group terms, and custom options.`);
      setContextBanner(`Diaspora Experience: ${pkg}`);
    } else if (service === "esim") {
      const c = searchParams.get("country") || "International";
      const plan = searchParams.get("plan") || "Data Plan";
      setDestination(`eSIM Roaming (${c})`);
      setMessage(`Hello Dellics Travels, I would like to purchase an Airalo eSIM data plan for ${c} (${plan}).`);
      setContextBanner(`eSIM Roaming: ${c}`);
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = {
      name,
      email,
      phone,
      destination,
      travelDate,
      travelers,
      message,
    };
    const parsed = inquireSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form fields.");
      return;
    }
    setPending(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(parsed.data).filter(([, value]) => value !== ""),
      );
      await postJson("/inquiries", { ...payload, kind: "INQUIRY" });
      toast.success("Inquiry received! Our certified travel consultant will contact you within hours.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setContextBanner(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sending failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {contextBanner ? (
        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 p-3.5 text-xs text-navy font-semibold">
          <Sparkles className="size-4 text-brand-orange shrink-0" />
          <span>Inquiring about: <strong className="text-brand-orange">{contextBanner}</strong></span>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="inquire-name" className="text-xs font-bold uppercase tracking-wider text-navy">
            Your Full Name *
          </Label>
          <Input
            id="inquire-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="e.g. Kwame Mensah"
            className="h-11 rounded-xl mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="inquire-email" className="text-xs font-bold uppercase tracking-wider text-navy">
            Email Address *
          </Label>
          <Input
            id="inquire-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="e.g. kwame@example.com"
            className="h-11 rounded-xl mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="inquire-phone" className="text-xs font-bold uppercase tracking-wider text-navy">
          Phone / WhatsApp Number
        </Label>
        <Input
          id="inquire-phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="e.g. +233 55 205 4174"
          className="h-11 rounded-xl mt-1.5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="inquire-destination" className="text-xs font-bold uppercase tracking-wider text-navy">
            Destination / Service
          </Label>
          <Input
            id="inquire-destination"
            name="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Dubai, London"
            className="h-11 rounded-xl mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="inquire-date" className="text-xs font-bold uppercase tracking-wider text-navy">
            Estimated Travel Date
          </Label>
          <Input
            id="inquire-date"
            name="travelDate"
            type="date"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="h-11 rounded-xl mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="inquire-travelers" className="text-xs font-bold uppercase tracking-wider text-navy">
            Travellers / Group Size
          </Label>
          <Input
            id="inquire-travelers"
            name="travelers"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            placeholder="e.g. 2 Adults"
            className="h-11 rounded-xl mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="inquire-message" className="text-xs font-bold uppercase tracking-wider text-navy">
          Special Requests / Additional Details *
        </Label>
        <Textarea
          id="inquire-message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          minLength={10}
          placeholder="Please share any specific requirements, flight cabin preference, hotel star rating, or budget..."
          className="rounded-2xl mt-1.5 resize-none text-sm"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="w-full sm:w-auto rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-10 shadow-lg"
      >
        {pending ? "Submitting Inquiry..." : "Submit Travel Inquiry"}
      </Button>
    </form>
  );
}
