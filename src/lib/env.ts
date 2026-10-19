import { z } from 'zod';

/**
 * Public environment variables (inlined into the browser bundle at build
 * time, so they must start with NEXT_PUBLIC_ and never contain secrets).
 *
 * Next.js only inlines variables that are referenced literally
 * (`process.env.NEXT_PUBLIC_X`), so each one is listed explicitly here.
 * Server-only variables (e.g. API_INTERNAL_URL in module 14) get their own
 * schema in a server-only file.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid public environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const publicEnv = parsed.data;
