import { z } from "zod";

export const demographics = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+1\d{10}$/, "Phone number must be in the format +1XXXXXXXXXX"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export const health = z.object({
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  bloodType: z.enum([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "unknown",
  ]),
  allergies: z.string().optional(),
  medications: z.string().optional(),
});

export const financial = z.object({
  employmentStatus: z.enum([
    "employed",
    "unemployed",
    "self-employed",
    "retired",
    "student",
  ]),
  annualIncome: z.string().min(1, "Annual income is required"),
  employer: z.string().optional(),
  jobTitle: z.string().optional(),
  bankName: z.string().min(1, "Bank name is required"),
});

export const completeSchema = z.object({
  demographics: demographics,
  health: health,
  financial: financial,
});

export type CompleteSchema = z.infer<typeof completeSchema>;
export type Demographics = z.infer<typeof demographics>;
export type Health = z.infer<typeof health>;
export type Financial = z.infer<typeof financial>;
