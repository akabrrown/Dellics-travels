"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/api";
import { contactSchema } from "@/lib/schemas";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setPending(true);
    try {
      // drop blank optional fields — the API DTO regexes reject empty strings
      const payload = Object.fromEntries(
        Object.entries(parsed.data).filter(([, value]) => value !== ""),
      );
      await postJson("/inquiries", { ...payload, kind: "CONTACT" });
      toast.success("Message sent — we'll reply shortly.");
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
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-phone">Phone (optional)</Label>
        <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" required rows={5} minLength={10} />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
