"use client";

import { LogOut, User } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumbs } from "./Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  items: BreadcrumbItem[];
  // Conteúdo opcional do canto esquerdo (ex.: logo na página de FAQ).
  leading?: ReactNode;
}

export function Header({ items, leading }: HeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center bg-background px-6">
      <div className="flex justify-start">{leading}</div>

      <div className="flex justify-center">
        <Breadcrumbs items={items} />
      </div>

      <div className="flex justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-full border border-border py-1 pl-3 pr-1 transition-colors hover:bg-card"
          >
            <span className="hidden text-sm text-foreground sm:block">
              {user?.nome || "Usuário"}
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground">
              <User size={16} />
            </span>
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-md border border-border bg-background py-1 shadow-lg">
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                  <User size={16} className="shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-card"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
