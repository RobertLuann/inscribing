"use client";

import {
  BookText,
  Copy,
  HelpCircle,
  MoreHorizontal,
  PanelLeft,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import type { Collection } from "@/types/collection";

interface SidebarProps {
  collections: Collection[];
  selectedId?: number;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onRename: (id: number) => void;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
}

export function Sidebar({
  collections,
  selectedId,
  onSelect,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-background transition-all duration-200",
        expanded ? "w-64" : "w-16",
      )}
    >
      {/* Cabeçalho: logo + botão de recolher */}
      <div
        className={cn(
          "flex h-14 items-center px-3",
          expanded ? "justify-between" : "justify-center",
        )}
      >
        {expanded && (
          <span className="inline-flex items-center gap-2">
            <BrandMark className="h-6 w-6 text-foreground" />
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Inscribing
            </span>
          </span>
        )}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Recolher menu" : "Expandir menu"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Rótulo da seção */}
      <div className="px-4 pb-1 pt-3">
        <span className="text-xs font-medium text-muted-foreground">
          {expanded ? "Coleções" : "Col..."}
        </span>
      </div>

      {/* Lista de coleções */}
      <nav className="flex-1 overflow-y-auto px-2">
        {collections.map((collection) => (
          <div key={collection.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(collection.id)}
              title={collection.titulo}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-card",
                expanded ? "text-left" : "justify-center",
                selectedId === collection.id && "bg-card font-medium",
              )}
            >
              <BookText size={18} className="shrink-0 text-foreground" />
              {expanded && (
                <span className="flex-1 truncate text-foreground">
                  {collection.titulo}
                </span>
              )}
            </button>

            {expanded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(
                    menuOpenId === collection.id ? null : collection.id,
                  );
                }}
                aria-label="Opções da coleção"
                className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:bg-border/40 hover:text-foreground group-hover:opacity-100"
              >
                <MoreHorizontal size={16} />
              </button>
            )}

            {menuOpenId === collection.id && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpenId(null)}
                />
                <div className="absolute right-1 top-full z-20 mt-1 w-40 rounded-md border border-border bg-background py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpenId(null);
                      onRename(collection.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                  >
                    <Pencil size={14} />
                    Renomear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpenId(null);
                      onDuplicate(collection.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-card"
                  >
                    <Copy size={14} />
                    Duplicar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpenId(null);
                      onDelete(collection.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-card"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* Nova coleção */}
        <button
          type="button"
          onClick={onCreate}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
            !expanded && "justify-center",
          )}
        >
          <Plus size={18} className="shrink-0" />
          {expanded && <span>Nova Coleção</span>}
        </button>
      </nav>

      {/* Ajuda e FAQ */}
      <div className="p-3">
        <a
          href="/faq"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
            !expanded && "justify-center",
          )}
        >
          <HelpCircle size={18} className="shrink-0" />
          {expanded && <span>Ajuda e FAQ</span>}
        </a>
      </div>
    </aside>
  );
}
