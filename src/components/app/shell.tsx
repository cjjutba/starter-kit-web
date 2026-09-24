"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronsUpDown, LogOut, Menu, MoreHorizontal, NotebookPen, Plus, Settings, Shield, UserRound } from "lucide-react";
import { Drawer } from "@/components/primitives/drawer";
import { ThemeMenuRow } from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { settingsSections } from "@/content/settings-sections";
import { authClient } from "@/lib/auth/client";
import type { Membership } from "@/lib/auth/organisations";
import { roleLabel } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

// The app frame. Laptop first: a 272 px sidebar behind a hairline and a top
// bar on phones, where the whole sidebar slides in from the left. The
// organisation sits at the top of the sidebar, not the product name, because
// the person working here already knows what they opened. The account sits
// at the bottom and opens into appearance, the account page, privacy and sign
// out. Settings opens into its sections, so each one is a page of its own.
// Every page and action still checks on the server. A link is not a
// permission.

// Each entry is active on its own href and on every path under match, so a
// new entry does not light up on another entry's pages.
const nav = [{ label: "Notes", href: "/app", match: "/app/notes", icon: NotebookPen }];
const settingsHref = "/app/settings";

const menuContent = "w-64 rounded-guide border-0 bg-sheet p-1.5 ring-1 ring-divider shadow-lifted";
const menuItem = "rounded-tag px-3 py-2.5 text-small";
const rowTrigger =
  "flex w-full min-w-0 items-center gap-2.5 rounded-input px-2 py-2 text-left transition-colors duration-150 hover:bg-sheet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page motion-reduce:transition-none";

/** "Ana R. Reyes" reads as "AR". */
function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

export function AppShell({
  user,
  organisation,
  memberships,
  canCreate,
  children,
}: {
  user: { name: string; email: string };
  organisation: Membership;
  memberships: Membership[];
  /** features.multipleOrganisations. Offers the way to make another. */
  canCreate: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  // Open while you are inside settings, unless you closed it yourself.
  const [settingsToggled, setSettingsToggled] = useState<boolean | null>(null);
  const [switching, setSwitching] = useState(false);

  const inSettings = pathname.startsWith(settingsHref);
  const settingsOpen = settingsToggled ?? inSettings;

  async function switchTo(organisationId: string) {
    if (organisationId === organisation.id) return;
    setSwitching(true);
    try {
      const { error } = await authClient.organization.setActive({ organizationId: organisationId });
      // A refusal leaves the person where they were, rather than on /app in
      // the organisation they were trying to leave.
      if (error) return;
      router.push("/app");
      router.refresh();
    } finally {
      setSwitching(false);
    }
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const organisationMark = (
    <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-tag bg-action text-label font-semibold text-on-action">
      {organisation.name.trim().charAt(0).toUpperCase()}
    </span>
  );

  const organisationSwitcher = (
    <DropdownMenu>
      <DropdownMenuTrigger className={rowTrigger} disabled={switching}>
        {organisationMark}
        <span className="min-w-0 flex-1 break-words text-small font-medium">{organisation.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-text-2" strokeWidth={1.5} aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn(menuContent, "w-72")}>
        {memberships.map((membership) => (
          <DropdownMenuItem
            key={membership.id}
            className={cn(menuItem, "flex items-center justify-between gap-3")}
            onSelect={() => switchTo(membership.id)}
          >
            <span className="min-w-0">
              <span className="block break-words">{membership.name}</span>
              <span className="block text-label text-text-2">{roleLabel(membership.role)}</span>
            </span>
            {membership.id === organisation.id ? <Check className="size-4 shrink-0" strokeWidth={1.5} aria-label="Current" /> : null}
          </DropdownMenuItem>
        ))}
        {canCreate ? (
          <>
            <DropdownMenuSeparator className="my-1.5 bg-divider" />
            <DropdownMenuItem asChild className={cn(menuItem, "flex items-center gap-2")}>
              <Link href="/app/organisation/new">
                <Plus className="size-4" strokeWidth={1.5} aria-hidden /> Create another organisation
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const accountMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger className={rowTrigger}>
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-pill-2 text-label font-medium">
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block break-words text-small font-medium">{user.name}</span>
          <span className="block text-label text-text-2">{roleLabel(organisation.role)}</span>
        </span>
        <MoreHorizontal className="size-4 shrink-0 text-text-2" strokeWidth={1.5} aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8} className={menuContent}>
        <ThemeMenuRow />
        <DropdownMenuSeparator className="my-1.5 bg-divider" />
        <DropdownMenuItem asChild className={menuItem}>
          <Link href="/app/account" className="flex items-center gap-2">
            <UserRound className="size-4" strokeWidth={1.5} aria-hidden /> Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={menuItem}>
          <Link href="/privacy" className="flex items-center gap-2">
            <Shield className="size-4" strokeWidth={1.5} aria-hidden /> Privacy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1.5 bg-divider" />
        <DropdownMenuItem className={cn(menuItem, "flex items-center gap-2")} onSelect={signOut}>
          <LogOut className="size-4" strokeWidth={1.5} aria-hidden /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // One row shape for the whole sidebar, so a section and a page under it are
  // the same height and sit on the same left edge.
  const itemClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2.5 rounded-input px-2.5 py-2 text-small transition-colors duration-150 motion-reduce:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-page",
      active ? "bg-sheet font-medium text-text" : "text-text-2 hover:bg-sheet/70 hover:text-text",
    );

  const navList = (
    <ul className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.match);
        return (
          <li key={item.href}>
            <Link href={item.href} aria-current={active ? "page" : undefined} className={itemClass(active)}>
              <item.icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
              {item.label}
            </Link>
          </li>
        );
      })}
      <li>
        {/* The section header carries the deeper tone and the page under it
            the lighter one, so the row you are on is never the same fill as
            the group it belongs to. */}
        <button
          type="button"
          onClick={() => setSettingsToggled(!settingsOpen)}
          aria-expanded={settingsOpen}
          className={cn(itemClass(false), inSettings && "bg-divider font-medium text-text hover:bg-divider")}
        >
          <Settings className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
          Settings
          <ChevronDown
            className={cn("ml-auto size-4 shrink-0 text-text-3 transition-transform duration-150 motion-reduce:transition-none", settingsOpen && "rotate-180")}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
        {settingsOpen ? (
          <ul className="mt-0.5 flex flex-col gap-0.5 pl-4">
            {settingsSections.map((section) => {
              const href = section.segment ? `${settingsHref}/${section.segment}` : settingsHref;
              const on = section.segment ? pathname.startsWith(href) : pathname === settingsHref;
              return (
                <li key={section.label}>
                  <Link href={href} aria-current={on ? "page" : undefined} className={itemClass(on)}>
                    <section.icon className={cn("size-4 shrink-0", on ? "text-text" : "text-text-3")} strokeWidth={1.5} aria-hidden />
                    {section.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </li>
    </ul>
  );

  const sidebar = (
    <>
      <div>{organisationSwitcher}</div>
      <nav aria-label="Main" className="mt-5 min-h-0 flex-1 overflow-y-auto">
        {navList}
      </nav>
      <div className="mt-4 border-t border-divider pt-2">{accountMenu}</div>
    </>
  );

  return (
    <div className="min-h-dvh bg-page lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col border-r border-divider px-3 py-4 lg:flex print:hidden">{sidebar}</aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex min-h-14 items-center gap-2 border-b border-divider bg-page/95 px-2 backdrop-blur lg:hidden print:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid size-touch shrink-0 place-items-center rounded-full text-text-2 hover:bg-pill-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <Link href="/app" className="flex min-w-0 items-center gap-2.5 rounded-input px-1 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
            {organisationMark}
            <span className="min-w-0 break-words text-small font-medium">{organisation.name}</span>
          </Link>
        </header>

        <Drawer
          open={menuOpen}
          onOpenChange={setMenuOpen}
          title="Menu"
          className="flex w-sidebar max-w-sidebar flex-col gap-0 border-r border-divider bg-page px-3 py-4 text-text"
        >
          {sidebar}
        </Drawer>

        <main className="mx-auto w-full max-w-content px-4 pb-24 pt-4 md:px-6 lg:px-8 lg:pt-8 print:max-w-none print:p-0">{children}</main>
      </div>
    </div>
  );
}
