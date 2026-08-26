"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/api";
import { inquireSchema } from "@/lib/schemas";

export function InquireForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = inquireSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setPending(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(parsed.data).filter(([, value]) => value !== ""),
      );
      await postJson("/inquiries", { ...payload, kind: "INQUIRY" });
      toast.success("Inquiry received — an expert will contact you shortly.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sending failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="inquire-name">Name</Label>
          <Input id="inquire-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="inquire-email">Email</Label>
          <Input id="inquire-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <Label htmlFor="inquire-phone">Phone (optional)</Label>
        <Input id="inquire-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="inquire-destination">Destination</Label>
          <Input id="inquire-destination" name="destination" placeholder="e.g. Zanzibar" />
        </div>
        <div>
          <Label htmlFor="inquire-date">Travel date</Label>
          <Input id="inquire-date" name="travelDate" type="date" />
        </div>
        <div>
          <Label htmlFor="inquire-travelers">Travellers</Label>
          <Input id="inquire-travelers" name="travelers" placeholder="e.g. 2 Adults" />
        </div>
      </div>
      <div>
        <Label htmlFor="inquire-message">Message</Label>
        <Textarea id="inquire-message" name="message" required rows={5} minLength={10} />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        {pending ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
