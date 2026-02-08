import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
      <h1 className="text-lg font-bold md:hidden">Gastei</h1>
      <div className="hidden md:block" />
      <UserButton />
    </header>
  );
}
