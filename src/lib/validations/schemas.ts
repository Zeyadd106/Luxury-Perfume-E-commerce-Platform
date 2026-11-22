import { z } from "zod";

export const emailSchema = z.string().email("Please enter a valid email address");

export const newsletterSchema = z.object({
  email: emailSchema,
  firstName: z.string().max(60).optional(),
});
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: emailSchema,
  subject: z.string().min(1, "Please select a subject").max(120),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(60),
    lastName: z.string().min(1, "Last name is required").max(60),
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  email: emailSchema,
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+()\-.\s\d]+$/, "Invalid phone number"),
  address1: z.string().min(1, "Address is required").max(120),
  address2: z.string().max(120).optional(),
  city: z.string().min(1, "City is required").max(80),
  country: z.string().min(1, "Country is required").max(80),
  postalCode: z.string().min(3, "Postal code is required").max(12),
});
export type AddressFormValues = z.infer<typeof addressSchema>;

export const checkoutSchema = addressSchema.extend({
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.literal("cod"),
  discountCode: z.string().max(30).optional(),
});
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CONTACT_SUBJECTS = [
  "Order & Shipping",
  "Returns & Exchanges",
  "Product Questions",
  "Wholesale & Partnerships",
  "Other",
];
