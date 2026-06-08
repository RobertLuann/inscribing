"use client";

import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumbs } from "./Breadcrumbs";

interface HeaderProps {
  collectionName?: string;
}

export function Header({ collectionName }: HeaderProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Inscribing", href: "/workspace" },
    ...(collectionName ? [{ label: collectionName }] : []),
  ];

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-card transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-medium">
            {user?.nome?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="text-sm text-foreground hidden sm:block">
            {user?.nome || "Usuário"}
          </span>
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-md border border-border bg-background shadow-lg">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                <User size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-card transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
