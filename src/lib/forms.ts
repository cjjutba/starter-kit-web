import { z } from "zod";

/** The first message for each field that failed, keyed by field name, for a form's fieldErrors. */
export function firstErrors(error: z.ZodError): Record<string, string | undefined> {
  const fields = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(Object.entries(fields).map(([field, messages]) => [field, messages?.[0]]));
}

/** An id passed straight to an action from a client component, checked like any other input. */
export const idSchema = z.string().trim().min(1);
