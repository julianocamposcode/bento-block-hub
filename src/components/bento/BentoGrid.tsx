import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import type { Widget, WidgetType } from "@/lib/types";
import type { Profile } from "@/lib/types";
import { SIZE_CLASSES, WidgetContent } from "./widgets";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  widgets: Widget[];
  profile: Profile;
  isOwner: boolean;
  editMode: boolean;
  onReorder: (widgets: Widget[]) => void;
  onEdit: (widget: Widget) => void;
  onAdd: (type: WidgetType) => void;
}

export function BentoGrid({
  widgets,
  profile,
  isOwner,
  editMode,
  onReorder,
  onEdit,
  onAdd,
}: BentoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = widgets.findIndex((w) => w.id === active.id);
    const newIdx = widgets.findIndex((w) => w.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const next = arrayMove(widgets, oldIdx, newIdx).map((w, i) => ({
      ...w,
      position_index: i,
    }));
    onReorder(next);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgets.map((w) => w.id)} strategy={rectSortingStrategy}>
        <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {widgets.map((w, i) => (
            <SortableBlock
              key={w.id}
              widget={w}
              profile={profile}
              editMode={editMode && isOwner}
              onEdit={() => onEdit(w)}
              delay={i * 70}
            />
          ))}
          {isOwner && editMode && (
            <AddBlockButton onAdd={onAdd} />
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableBlock({
  widget,
  profile,
  editMode,
  onEdit,
  delay,
}: {
  widget: Widget;
  profile: Profile;
  editMode: boolean;
  onEdit: () => void;
  delay: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id, disabled: !editMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    animationDelay: `${delay}ms`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative animate-bento-in",
        SIZE_CLASSES[widget.size],
        editMode && "animate-wiggle",
        isDragging && "z-10 opacity-70",
      )}
    >
      <div
        className={cn(
          "glass-card relative h-full w-full overflow-hidden",
          !editMode && "glass-card-hover",
        )}
      >
        <WidgetContent widget={widget} profile={profile} />

        {editMode && (
          <>
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="absolute left-2 top-2 z-20 grid h-8 w-8 cursor-grab place-items-center rounded-full bg-background/80 text-foreground backdrop-blur-md active:cursor-grabbing"
              aria-label="Arrastar"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
              aria-label="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AddBlockButton({ onAdd }: { onAdd: (t: WidgetType) => void }) {
  const [open, setOpen] = useState(false);
  const options: { type: WidgetType; label: string; desc: string }[] = [
    { type: "social", label: "Rede social", desc: "Botão com ícone" },
    { type: "link", label: "Link", desc: "Card com título e URL" },
    { type: "showcase", label: "Showcase", desc: "Imagem + título" },
    { type: "newsletter", label: "Newsletter", desc: "Captura de e-mail" },
    { type: "map", label: "Mapa", desc: "Localização" },
    { type: "text", label: "Texto", desc: "Bloco de texto" },
  ];
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="glass-card glass-card-hover col-span-1 row-span-1 grid aspect-square place-items-center border-dashed text-muted-foreground hover:text-primary">
          <div className="flex flex-col items-center gap-2">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-xs font-medium">Adicionar bloco</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-card w-56 border-glass-border" align="end">
        {options.map((o) => (
          <DropdownMenuItem
            key={o.type}
            onClick={() => onAdd(o.type)}
            className="flex flex-col items-start gap-0.5 py-2"
          >
            <span className="font-medium">{o.label}</span>
            <span className="text-xs text-muted-foreground">{o.desc}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
