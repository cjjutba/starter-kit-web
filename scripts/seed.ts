import { config } from "dotenv";
import { eq } from "drizzle-orm";

// The value .env.example shipped with before it went blank. It is public, so
// an owner seeded with it is an owner anyone can sign in as. setup generates
// a real one.
const publicPassword = "change-this-before-anyone-else-does";

// Creates one person and, through the sign up hook, their personal
// organisation. That is the whole seed. It exists so sign in works on a
// fresh database, and it does nothing on a database that already has the
// person. Real products get their data from real people.

config({ path: ".env.local", quiet: true });

async function main() {
  // Better Auth stores addresses lowercased, so the lookup below has to match.
  const email = (process.env.SEED_EMAIL ?? "owner@example.com").toLowerCase();
  const password = process.env.SEED_PASSWORD;
  if (!password || password === publicPassword) {
    throw new Error("Set SEED_PASSWORD in .env.local first. Generate one with: openssl rand -base64 24");
  }
  const name = process.env.SEED_NAME ?? "Owner";

  // Imported after the env file is loaded, because these modules read it.
  const { db } = await import("../src/lib/db/client");
  const { user } = await import("../src/lib/db/schema");
  const { auth } = await import("../src/lib/auth/server");

  const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
  if (existing.length > 0) {
    console.log(`Seed: ${email} already exists. Nothing to do.`);
    return;
  }

  await auth.api.signUpEmail({ body: { name, email, password } });
  // Sign up sends a verification mail to the log and creates no session
  // until the link is opened. The seeded owner is the way in on a database
  // nobody else can reach yet, so the address is marked verified here.
  await db.update(user).set({ emailVerified: true }).where(eq(user.email, email));
  console.log(`Seed: created ${email} and a personal organisation.`);
  console.log(`Sign in with ${email} and the password from SEED_PASSWORD.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
