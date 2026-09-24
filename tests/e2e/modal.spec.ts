import { expect, test } from "@playwright/test";

// DESIGN.md: a modal that asks a question owns the work it starts. The rule is
// worth a test rather than a paragraph, because the failure mode is a modal
// that closes on click and leaves the person unsure whether anything happened.
//
// The design sheet carries one modal that resolves and one that comes back
// with a reason, both on a deliberate delay, so the in flight state is real
// enough to assert against.

test.describe("a modal owns the work it starts", () => {
  test("spins in place, holds open while the work runs, then closes", async ({ page }) => {
    await page.goto("/design");

    await page.getByRole("button", { name: "Confirm that succeeds" }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    const confirm = modal.getByRole("button", { name: "Send invitation" });
    await confirm.click();

    // Still open, and the pill says so rather than the page going blank.
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("button", { name: "Sending" })).toHaveAttribute("aria-busy", "true");

    // Closes only once the work resolves.
    await expect(modal).toBeHidden({ timeout: 5000 });
  });

  test("stays open on failure and puts the reason inside", async ({ page }) => {
    await page.goto("/design");

    await page.getByRole("button", { name: "Confirm that fails" }).click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    await modal.getByRole("button", { name: "Delete note" }).click();
    await expect(modal.getByRole("alert")).toContainText("already deleted", { timeout: 5000 });
    await expect(modal).toBeVisible();
  });

  test("cannot be dismissed while the work is in flight", async ({ page }) => {
    await page.goto("/design");

    await page.getByRole("button", { name: "Confirm that succeeds" }).click();
    const modal = page.getByRole("dialog");
    await modal.getByRole("button", { name: "Send invitation" }).click();
    const busy = modal.getByRole("button", { name: "Sending" });
    await expect(busy).toHaveAttribute("aria-busy", "true");

    // Escape during the work is ignored, so a half finished action cannot be
    // dismissed into silence.
    await page.keyboard.press("Escape");
    await expect(modal).toBeVisible();

    // The close button goes away rather than sitting there looking live while
    // it cannot close anything.
    await expect(modal.getByRole("button", { name: "Close" })).toHaveCount(0);

    // Still busy, so the two checks above ran against the work in flight and
    // not against a modal that had already closed, where they pass for free.
    await expect(busy).toHaveAttribute("aria-busy", "true");

    await expect(modal).toBeHidden({ timeout: 5000 });
  });
});
