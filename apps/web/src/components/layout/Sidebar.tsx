"use client";

import {
  Copy,
  HelpCircle,
  MoreHorizontal,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
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
      {/* Toggle button + Create */}
      <div className="flex items-center gap-1 p-3 border-b border-border">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        >
          {expanded ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
        {expanded && (
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 justify-start gap-2"
            onClick={onCreate}
          >
            <Plus size={16} />
            Nova Coleção
          </Button>
        )}
      </div>

      {/* Collection list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {collections.map((collection) => (
          <div key={collection.id} className="relative">
            <button
              type="button"
              onClick={() => onSelect(collection.id)}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 text-sm text-left transition-colors hover:bg-card",
                selectedId === collection.id && "bg-card font-medium",
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded bg-border/50 text-xs font-medium text-muted-foreground shrink-0">
                {collection.titulo.charAt(0).toUpperCase()}
              </div>
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
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-border/50 transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
            )}

            {menuOpenId === collection.id && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpenId(null)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-md border border-border bg-background shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpenId(null);
                      onRename(collection.id);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-card transition-colors"
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
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-card transition-colors"
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
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-card transition-colors"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Help link */}
      <div className="border-t border-border p-3">
        <a
          href="/faq"
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
            !expanded && "justify-center",
          )}
        >
          <HelpCircle size={18} />
          {expanded && <span>Ajuda e FAQ</span>}
        </a>
      </div>
    </aside>
  );
}
