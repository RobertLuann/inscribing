"use client";

import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatFAB } from "@/components/chat/ChatFAB";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useDuplicateCollection,
  useUpdateCollection,
} from "@/hooks/useCollections";
import type { Collection } from "@/types/collection";

export default function WorkspacePage() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Estado dos modais de gestão de coleções.
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [renameTarget, setRenameTarget] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  const { data: collections = [] } = useCollections();
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const duplicateCollection = useDuplicateCollection();

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [token, authLoading, router]);

  if (authLoading || !token) return null;

  const selectedCollection = collections.find((c) => c.id === selectedId);

  function openCreate() {
    setRenameTarget(null);
    setNameValue("");
    setNameModalOpen(true);
  }

  function openRename(id: number) {
    const target = collections.find((c) => c.id === id) ?? null;
    if (!target) return;
    setRenameTarget(target);
    setNameValue(target.titulo);
    setNameModalOpen(true);
  }

  async function submitName() {
    const titulo = nameValue.trim();
    if (!titulo) return;

    if (renameTarget) {
      await updateCollection.mutateAsync({
        id: renameTarget.id,
        data: { titulo },
      });
    } else {
      const created = await createCollection.mutateAsync({ titulo });
      setSelectedId(created.id);
    }
    setNameModalOpen(false);
    setNameValue("");
    setRenameTarget(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteCollection.mutateAsync(deleteTarget.id);
    if (selectedId === deleteTarget.id) setSelectedId(null);
    setDeleteTarget(null);
  }

  async function handleDuplicate(id: number) {
    const copy = await duplicateCollection.mutateAsync(id);
    setSelectedId(copy.id);
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        collections={collections}
        selectedId={selectedId ?? undefined}
        onSelect={setSelectedId}
        onCreate={openCreate}
        onRename={openRename}
        onDuplicate={handleDuplicate}
        onDelete={(id) =>
          setDeleteTarget(collections.find((c) => c.id === id) ?? null)
        }
      />

      <div className="flex flex-1 flex-col">
        <Header
          items={[
            { label: "Inscribing", href: "/workspace" },
            ...(selectedCollection
              ? [{ label: selectedCollection.titulo }]
              : []),
          ]}
        />

        <main className="flex-1 overflow-y-auto">
          {selectedCollection ? (
            <BlockEditor
              collectionId={selectedCollection.id}
              title={selectedCollection.titulo}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
              <FileText size={48} className="text-border" />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Selecione uma coleção
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Escolha uma coleção na barra lateral ou crie uma nova para
                  começar.
                </p>
              </div>
              <Button onClick={openCreate}>Criar Nova Coleção</Button>
            </div>
          )}
        </main>
      </div>

      <ChatFAB onClick={() => setChatOpen(!chatOpen)} />
      {chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}

      {/* Modal de criar / renomear coleção */}
      <Modal
        isOpen={nameModalOpen}
        onClose={() => setNameModalOpen(false)}
        title={renameTarget ? "Renomear coleção" : "Nova coleção"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitName();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            label="Título"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="Minha coleção"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNameModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                !nameValue.trim() ||
                createCollection.isPending ||
                updateCollection.isPending
              }
            >
              {renameTarget ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Excluir coleção"
      >
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir{" "}
          <span className="font-medium text-foreground">
            {deleteTarget?.titulo}
          </span>
          ? Todos os blocos serão removidos permanentemente.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteCollection.isPending}
          >
            Excluir
          </Button>
        </div>
      </Modal>
    </div>
  );
}
