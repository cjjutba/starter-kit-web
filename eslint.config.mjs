import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Three rules from AGENTS.md live here instead of in prose, so an agent that
// skims the manual still cannot ship the bug.
//
// 1. The raw database handle never leaves the data layer. Application code
//    goes through @/lib/db/scoped, which cannot be called without an
//    organisation id.
// 2. Only src/lib/time imports date-fns. Every other file uses its helpers,
//    so timezone handling stays in one place.
// 3. Only src/components/primitives opens a dialog. Product code uses Modal
//    and ConfirmModal, which keep the modal open until the work resolves,
//    and Drawer for the phone sidebar.
//    Reach for the raw dialog and it is possible to close on click and leave
//    the person guessing whether anything happened.

const rawDatabaseMessage =
  "Import forOrganisation from @/lib/db/scoped instead. The raw handle is only for src/lib/db, src/lib/auth, src/lib/mail, src/lib/guard, scripts and tests.";
const rawDateMessage = "Only src/lib/time imports date-fns. Add a helper there and use it.";
const rawDialogMessage =
  "Import Modal or ConfirmModal from @/components/primitives/modal instead. They spin the confirm pill in place, hold the modal open while the server works, and close only after it resolves.";

const restrictRawDatabase = {
  paths: [{ name: "@/lib/db/client", message: rawDatabaseMessage }],
  patterns: [
    { group: ["**/db/client", "*/db/client", "../db/client", "../../db/client", "../../../db/client"], message: rawDatabaseMessage },
  ],
};

// The shadcn sheet is a dialog too, and radix-ui exports the raw ones. The
// drawer primitive is the sanctioned way to the sheet.
const restrictRawDialog = {
  paths: [
    { name: "@/components/ui/dialog", message: rawDialogMessage },
    { name: "@/components/ui/sheet", message: rawDialogMessage + " For a panel from the edge, use Drawer from @/components/primitives/drawer." },
    { name: "radix-ui", importNames: ["Dialog", "AlertDialog"], message: rawDialogMessage },
  ],
  patterns: [
    { group: ["**/ui/dialog", "*/ui/dialog", "../ui/dialog", "./dialog", "**/ui/sheet", "*/ui/sheet", "../ui/sheet"], message: rawDialogMessage },
  ],
};

const restrictRawDates = {
  paths: [
    { name: "date-fns", message: rawDateMessage },
    { name: "@date-fns/tz", message: rawDateMessage },
  ],
  // "date-fns/format" is the same library through a side door.
  patterns: [{ group: ["date-fns/*", "@date-fns/*"], message: rawDateMessage }],
};

const dataLayer = ["src/lib/db/**", "src/lib/auth/**", "src/lib/mail/**", "src/lib/guard/**"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "drizzle/**", "playwright-report/**", "test-results/**"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [...dataLayer, "src/lib/time/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...restrictRawDatabase.paths, ...restrictRawDates.paths, ...restrictRawDialog.paths],
          patterns: [...restrictRawDatabase.patterns, ...restrictRawDates.patterns, ...restrictRawDialog.patterns],
        },
      ],
    },
  },
  {
    // The primitives are where the dialog is allowed to be imported, because
    // they are what everything else has to go through.
    files: ["src/components/primitives/**", "src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [...restrictRawDatabase.paths, ...restrictRawDates.paths], patterns: [...restrictRawDatabase.patterns, ...restrictRawDates.patterns] },
      ],
    },
  },
  {
    files: dataLayer,
    rules: { "no-restricted-imports": ["error", restrictRawDates] },
  },
  {
    files: ["src/lib/time/**"],
    rules: { "no-restricted-imports": ["error", restrictRawDatabase] },
  },
]);

export default eslintConfig;
