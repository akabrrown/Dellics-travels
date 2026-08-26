import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Phone number looks invalid")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export const inquireSchema = contactSchema.extend({
  destination: z.string().max(120).optional().or(z.literal("")),
  travelDate: z.string().optional().or(z.literal("")),
  travelers: z.string().max(60).optional().or(z.literal("")),
});

export const hotelSearchSchema = z
  .object({
    destination: z.string().min(2, "Enter a destination").max(120),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-in date"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-out date"),
    guests: z.number().int().min(1).max(16),
    rooms: z.number().int().min(1).max(8),
  })
  .refine((v) => v.checkOut > v.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type ContactInput = z.infer<typeof contactSchema>;
export type InquireInput = z.infer<typeof inquireSchema>;
export type HotelSearchInput = z.infer<typeof hotelSearchSchema>;
