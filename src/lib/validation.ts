import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

// SiteProject Validation
export const siteProjectCreateSchema = z.object({
  category: z.enum(["design", "it", "photo", "web"]),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  tags: z.array(z.string()),
  emoji: z.string().optional().nullable(),
  gradient: z.string().default("linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)"),
  image: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  liveUrl: z.string().url().optional().or(z.literal("")).nullable(),
  codeUrl: z.string().url().optional().or(z.literal("")).nullable(),
  sortOrder: z.number().int().default(0),
});

export const siteProjectUpdateSchema = siteProjectCreateSchema.partial();

// Experience Validation
export const experienceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  dateRange: z.string().min(1).max(100),
  tasks: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

// ProfessionalEndorsement Validation
export const professionalEndorsementCreateSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  phone: z.string().optional().nullable(),
});

export const professionalEndorsementUpdateSchema = professionalEndorsementCreateSchema.partial();

// Skill Validation (Enhanced)
export const skillCreateSchema = z.object({
  name: z.string().min(1).max(200),
  level: z.number().int().min(0).max(100).default(80),
  category: z.enum(["design", "it", "web", "photo"]),
  icon: z.string().url().optional().or(z.literal("")).nullable(),
  emoji: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const skillUpdateSchema = skillCreateSchema.partial();

// Legacy Validations (kept for backward compatibility where needed)
export const projectCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  repoUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
});

export const creativeShowcaseCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  mediaUrl: z.string().url().optional().or(z.literal("")),
});

export const techPathCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
});
