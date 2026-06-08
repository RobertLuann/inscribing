"use client";

import { LogOut, Pencil, User } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
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
  const { user, updateProfile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openEdit() {
    setMenuOpen(false);
    setNameValue(user?.nome ?? "");
    setError(null);
    setEditOpen(true);
  }

  async function saveName() {
    const nome = nameValue.trim();
    if (!nome) return;
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ nome });
      setEditOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar o nome.",
      );
    } finally {
      setSaving(false);
    }
  }

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
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user?.nome}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                >
                  <Pencil size={16} />
                  Editar nome
                </button>
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

      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar nome"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveName();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Nome"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="Seu nome"
            error={error ?? undefined}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!nameValue.trim() || saving}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
