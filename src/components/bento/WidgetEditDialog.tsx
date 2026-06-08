import { useState } from "react";
import type { Widget, WidgetSize, WidgetType, WidgetContent } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface WidgetDraft {
  id?: string;
  type: WidgetType;
  content: WidgetContent;
  size: WidgetSize;
}

const SIZE_OPTIONS: { value: WidgetSize; label: string }[] = [
  { value: "1x1", label: "Pequeno (1×1)" },
  { value: "2x1", label: "Largo (2×1)" },
  { value: "1x2", label: "Alto (1×2)" },
  { value: "2x2", label: "Grande (2×2)" },
];

const TYPE_LABEL: Record<WidgetType, string> = {
  profile: "Perfil",
  social: "Rede social",
  link: "Link",
  showcase: "Showcase",
  newsletter: "Newsletter",
  map: "Mapa",
  text: "Texto",
};

export function WidgetEditDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: WidgetDraft;
  onSave: (draft: WidgetDraft) => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState<WidgetDraft>(initial);

  // Reset when opened
  function update<K extends keyof WidgetDraft>(k: K, v: WidgetDraft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function updateContent(patch: Partial<WidgetContent>) {
    setDraft((d) => ({ ...d, content: { ...d.content, ...patch } }));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (v) setDraft(initial);
      }}
    >
      <DialogContent className="glass-card max-w-md border-glass-border">
        <DialogHeader>
          <DialogTitle>
            {initial.id ? "Editar bloco" : "Adicionar bloco"} ·{" "}
            {TYPE_LABEL[draft.type]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {draft.type !== "profile" && (
            <div>
              <Label>Tamanho</Label>
              <Select
                value={draft.size}
                onValueChange={(v) => update("size", v as WidgetSize)}
              >
                <SelectTrigger className="mt-1.5 bg-glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {draft.type === "social" && (
            <>
              <div>
                <Label>Plataforma</Label>
                <Select
                  value={draft.content.platform ?? "instagram"}
                  onValueChange={(v) =>
                    updateContent({ platform: v as WidgetContent["platform"] })
                  }
                >
                  <SelectTrigger className="mt-1.5 bg-glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["instagram", "linkedin", "github", "youtube", "twitter", "tiktok", "website"].map(
                      (p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={draft.content.url ?? ""}
                  onChange={(e) => updateContent({ url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1.5 bg-glass"
                />
              </div>
            </>
          )}

          {draft.type === "link" && (
            <>
              <div>
                <Label>Título</Label>
                <Input
                  value={draft.content.title ?? ""}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={draft.content.description ?? ""}
                  onChange={(e) => updateContent({ description: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={draft.content.url ?? ""}
                  onChange={(e) => updateContent({ url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1.5 bg-glass"
                />
              </div>
            </>
          )}

          {draft.type === "showcase" && (
            <>
              <div>
                <Label>Título</Label>
                <Input
                  value={draft.content.title ?? ""}
                  onChange={(e) => updateContent({ title: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Imagem (URL)</Label>
                <Input
                  value={draft.content.image_url ?? ""}
                  onChange={(e) => updateContent({ image_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={draft.content.url ?? ""}
                  onChange={(e) => updateContent({ url: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
            </>
          )}

          {draft.type === "newsletter" && (
            <>
              <div>
                <Label>Título</Label>
                <Input
                  value={draft.content.heading ?? ""}
                  onChange={(e) => updateContent({ heading: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input
                  value={draft.content.description ?? ""}
                  onChange={(e) => updateContent({ description: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Texto do botão</Label>
                <Input
                  value={draft.content.cta ?? ""}
                  onChange={(e) => updateContent({ cta: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
            </>
          )}

          {draft.type === "map" && (
            <div>
              <Label>Localização</Label>
              <Input
                value={draft.content.location ?? ""}
                onChange={(e) => updateContent({ location: e.target.value })}
                placeholder="São Paulo, Brasil"
                className="mt-1.5 bg-glass"
              />
            </div>
          )}

          {draft.type === "text" && (
            <>
              <div>
                <Label>Título (opcional)</Label>
                <Input
                  value={draft.content.heading ?? ""}
                  onChange={(e) => updateContent({ heading: e.target.value })}
                  className="mt-1.5 bg-glass"
                />
              </div>
              <div>
                <Label>Texto</Label>
                <Textarea
                  value={draft.content.body ?? ""}
                  onChange={(e) => updateContent({ body: e.target.value })}
                  rows={4}
                  className="mt-1.5 bg-glass"
                />
              </div>
            </>
          )}

          {draft.type === "profile" && (
            <p className="text-sm text-muted-foreground">
              Edite seus dados de perfil no botão "Editar perfil".
            </p>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          {onDelete ? (
            <Button
              variant="ghost"
              onClick={onDelete}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Excluir
            </Button>
          ) : (
            <span />
          )}
          <Button
            onClick={() => onSave(draft)}
            className="btn-primary-glow rounded-full px-6"
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
