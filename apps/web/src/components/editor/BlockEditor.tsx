"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import { useCallback, useEffect, useRef } from "react";
import {
  useBlocks,
  useCreateBlock,
  useDeleteBlock,
  useReorderBlocks,
  useUpdateBlock,
} from "@/hooks/useBlocks";
import type { Block, BlockType, ReorderItem } from "@/types/block";

interface BlockEditorProps {
  collectionId: number;
  title: string;
}

// Estrutura mínima de leitura de um bloco do BlockNote (tipagem estrutural,
// suficiente para extrair tipo/props/texto sem depender do schema genérico).
interface ReadableBlock {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  content?: unknown;
}

// Conteúdo simplificado do bloco do backend (texto puro).
function toInlineContent(conteudo: string) {
  return conteudo
    ? [{ type: "text" as const, text: conteudo, styles: {} }]
    : [];
}

// Extrai o texto puro de um bloco do BlockNote (ignora estilos/inline complexos).
function getPlainText(block: ReadableBlock): string {
  const content = block.content;
  if (!Array.isArray(content)) return "";
  return content
    .map((item: { type?: string; text?: string }) =>
      item.type === "text" ? (item.text ?? "") : "",
    )
    .join("");
}

// Backend → BlockNote.
function backendToBlockNote(block: Block) {
  const id = `srv-${block.id}`;
  const content = toInlineContent(block.conteudo);
  switch (block.tipo) {
    case "titulo1":
      return { id, type: "heading" as const, props: { level: 1 }, content };
    case "titulo2":
      return { id, type: "heading" as const, props: { level: 2 }, content };
    case "titulo3":
      return { id, type: "heading" as const, props: { level: 3 }, content };
    case "tarefa":
      return {
        id,
        type: "checkListItem" as const,
        props: { checked: block.concluida },
        content,
      };
    case "lista-numerada":
      return { id, type: "numberedListItem" as const, content };
    case "lista-marcadores":
      return { id, type: "bulletListItem" as const, content };
    default:
      return { id, type: "paragraph" as const, content };
  }
}

// BlockNote → backend (tipo + concluida).
function blockNoteToTipo(block: ReadableBlock): {
  tipo: BlockType;
  concluida: boolean;
} {
  switch (block.type) {
    case "heading": {
      const level = Number(block.props?.level) || 1;
      const clamped = level >= 1 && level <= 3 ? level : 1;
      return { tipo: `titulo${clamped}` as BlockType, concluida: false };
    }
    case "checkListItem":
      return { tipo: "tarefa", concluida: Boolean(block.props?.checked) };
    case "numberedListItem":
      return { tipo: "lista-numerada", concluida: false };
    case "bulletListItem":
      return { tipo: "lista-marcadores", concluida: false };
    default:
      return { tipo: "texto", concluida: false };
  }
}

export function BlockEditor({ collectionId, title }: BlockEditorProps) {
  const { data: blocks } = useBlocks(collectionId);
  const createBlock = useCreateBlock();
  const updateBlock = useUpdateBlock();
  const deleteBlock = useDeleteBlock();
  const reorderBlocks = useReorderBlocks();

  // Coleção atualmente carregada no editor (evita recarregar a cada render).
  const loadedCollectionRef = useRef<number | null>(null);
  // Mapeia o id do bloco no BlockNote → id do bloco no backend.
  const idMapRef = useRef<Map<string, number>>(new Map());
  // Snapshot do estado salvo no servidor, para diffs.
  const serverStateRef = useRef<Map<number, Block>>(new Map());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);

  const editor = useCreateBlockNote();

  // Carrega o conteúdo inicial quando os blocos da coleção chegam.
  useEffect(() => {
    if (!blocks) return;
    if (loadedCollectionRef.current === collectionId) return;
    loadedCollectionRef.current = collectionId;

    idMapRef.current = new Map();
    serverStateRef.current = new Map();
    for (const block of blocks) {
      idMapRef.current.set(`srv-${block.id}`, block.id);
      serverStateRef.current.set(block.id, block);
    }

    const initial = blocks.map(backendToBlockNote);
    // BlockNote exige ao menos um bloco no documento.
    editor.replaceBlocks(
      editor.document,
      initial.length > 0 ? initial : [{ type: "paragraph" as const }],
    );
  }, [blocks, collectionId, editor]);

  const persist = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      const doc = editor.document;
      const idMap = idMapRef.current;
      const serverState = serverStateRef.current;
      const seenServerIds = new Set<number>();

      // Cria / atualiza blocos na ordem do documento.
      for (let ordem = 0; ordem < doc.length; ordem++) {
        const block = doc[ordem] as ReadableBlock;
        const { tipo, concluida } = blockNoteToTipo(block);
        const conteudo = getPlainText(block);
        const serverId = idMap.get(block.id);

        if (serverId !== undefined) {
          seenServerIds.add(serverId);
          const prev = serverState.get(serverId);
          if (
            prev &&
            (prev.tipo !== tipo ||
              prev.conteudo !== conteudo ||
              prev.concluida !== concluida)
          ) {
            const updated = await updateBlock.mutateAsync({
              id: serverId,
              collectionId,
              data: { tipo, conteudo, concluida },
            });
            serverState.set(serverId, updated);
          }
        } else {
          const created = await createBlock.mutateAsync({
            collectionId,
            data: { tipo, conteudo, ordem },
          });
          idMap.set(block.id, created.id);
          serverState.set(created.id, created);
          seenServerIds.add(created.id);
        }
      }

      // Remove blocos que sumiram do documento.
      for (const serverId of [...serverState.keys()]) {
        if (!seenServerIds.has(serverId)) {
          await deleteBlock.mutateAsync({ id: serverId, collectionId });
          serverState.delete(serverId);
          for (const [bnId, sid] of idMap) {
            if (sid === serverId) idMap.delete(bnId);
          }
        }
      }

      // Reordena conforme a posição atual no documento.
      const items: ReorderItem[] = [];
      doc.forEach((block, ordem) => {
        const serverId = idMap.get(block.id);
        if (serverId !== undefined) items.push({ id: serverId, ordem });
      });
      const reordered =
        items.some((it, idx) => serverState.get(it.id)?.ordem !== idx) &&
        items.length > 0;
      if (reordered) {
        const result = await reorderBlocks.mutateAsync({ collectionId, items });
        for (const block of result) serverState.set(block.id, block);
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [
    editor,
    collectionId,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
  ]);

  // Salva com debounce a cada alteração do documento.
  function scheduleSave() {
    if (loadedCollectionRef.current !== collectionId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void persist();
    }, 800);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 px-[54px] text-4xl font-bold text-foreground">
        {title}
      </h1>
      <BlockNoteView editor={editor} onChange={scheduleSave} />
    </div>
  );
}
