import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, Widget, WidgetType } from "@/lib/types";
import { BentoGrid } from "@/components/bento/BentoGrid";
import {
  WidgetEditDialog,
  type WidgetDraft,
} from "@/components/bento/WidgetEditDialog";
import { ProfileEditDialog } from "@/components/bento/ProfileEditDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Grid3x3,
  LogOut,
  Pencil,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.username} · NoCode Folio` },
      {
        name: "description",
        content: `Perfil Bento de @${params.username} no NoCode Folio.`,
      },
      { property: "og:title", content: `@${params.username} · NoCode Folio` },
    ],
  }),
  component: ProfilePage,
});

const DEFAULT_CONTENT_BY_TYPE: Record<WidgetType, Record<string, unknown>> = {
  profile: {},
  social: { platform: "instagram", url: "" },
  link: { title: "Meu link", url: "" },
  showcase: { title: "Projeto", image_url: "" },
  newsletter: { heading: "Newsletter", cta: "Assinar" },
  map: { location: "" },
  text: { body: "Texto livre" },
};

const DEFAULT_SIZE_BY_TYPE: Record<WidgetType, "1x1" | "2x1" | "2x2" | "1x2"> = {
  profile: "2x2",
  social: "1x1",
  link: "1x1",
  showcase: "2x1",
  newsletter: "2x1",
  map: "1x1",
  text: "2x1",
};

function ProfilePage() {
  const { username } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetDraft | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);

  const isOwner = useMemo(
    () => !!user && !!profile && user.id === profile.id,
    [user, profile],
  );

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .maybeSingle();
      if (cancel) return;
      if (!p) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(p as Profile);
      const { data: ws } = await supabase
        .from("widgets")
        .select("*")
        .eq("profile_id", p.id)
        .order("position_index", { ascending: true });
      if (cancel) return;
      const list = (ws as Widget[]) ?? [];
      // Ensure a profile widget exists at the top for owner view
      const hasProfile = list.some((w) => w.type === "profile");
      if (!hasProfile) {
        list.unshift({
          id: "__profile__",
          profile_id: p.id,
          type: "profile",
          content: {},
          position_index: -1,
          size: "2x2",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      setWidgets(list);
      setLoading(false);
    })();
    return () => {
      cancel = true;
    };
  }, [username]);

  async function persistOrder(next: Widget[]) {
    setWidgets(next);
    const updates = next
      .filter((w) => w.id !== "__profile__")
      .map((w, i) =>
        supabase.from("widgets").update({ position_index: i }).eq("id", w.id),
      );
    await Promise.all(updates);
  }

  async function handleAdd(type: WidgetType) {
    if (!profile) return;
    const content = DEFAULT_CONTENT_BY_TYPE[type];
    const size = DEFAULT_SIZE_BY_TYPE[type];
    const position = widgets.length;
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        profile_id: profile.id,
        type,
        content,
        size,
        position_index: position,
      })
      .select("*")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    const w = data as Widget;
    setWidgets((prev) => [...prev, w]);
    setEditingWidget({
      id: w.id,
      type: w.type,
      content: w.content,
      size: w.size,
    });
  }

  async function handleSaveWidget(draft: WidgetDraft) {
    if (!draft.id) return;
    const { error } = await supabase
      .from("widgets")
      .update({ content: draft.content, size: draft.size })
      .eq("id", draft.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === draft.id ? { ...w, content: draft.content, size: draft.size } : w,
      ),
    );
    setEditingWidget(null);
    toast.success("Bloco salvo");
  }

  async function handleDeleteWidget(id: string) {
    const { error } = await supabase.from("widgets").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setEditingWidget(null);
    toast.success("Bloco removido");
  }

  async function handleSaveProfile(patch: Partial<Profile>) {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", profile.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    const newUsername = patch.username ?? profile.username;
    setProfile({ ...profile, ...patch } as Profile);
    setEditingProfile(false);
    toast.success("Perfil atualizado");
    if (patch.username && patch.username !== profile.username) {
      navigate({ to: "/$username", params: { username: newUsername } });
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/30" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold">Perfil não encontrado</h1>
          <p className="mt-2 text-muted-foreground">
            @{username} ainda não existe no NoCode Folio.
          </p>
          <Button asChild className="btn-primary-glow mt-6 rounded-full">
            <Link to="/">Voltar para home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="container mx-auto flex items-center justify-between px-4 py-5">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <Grid3x3 className="h-4 w-4" />
          <span className="font-semibold">NoCode Folio</span>
        </Link>
        {isOwner && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-full text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </header>

      <main className="container mx-auto max-w-4xl px-4">
        <BentoGrid
          widgets={widgets}
          profile={profile}
          isOwner={isOwner}
          editMode={editMode}
          onReorder={persistOrder}
          onEdit={(w) => {
            if (w.type === "profile") {
              setEditingProfile(true);
              return;
            }
            setEditingWidget({
              id: w.id,
              type: w.type,
              content: w.content,
              size: w.size,
            });
          }}
          onAdd={handleAdd}
        />
      </main>

      {isOwner && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="glass-card flex items-center gap-1 rounded-full p-1.5 backdrop-blur-xl">
            <Button
              size="sm"
              onClick={() => setEditMode((v) => !v)}
              className={
                editMode
                  ? "btn-primary-glow rounded-full px-4"
                  : "rounded-full bg-transparent px-4 text-foreground hover:bg-primary/15"
              }
            >
              {editMode ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" /> Concluído
                </>
              ) : (
                <>
                  <Pencil className="mr-1.5 h-4 w-4" /> Editar perfil
                </>
              )}
            </Button>
            {editMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingProfile(true)}
                className="rounded-full px-4"
              >
                <UserCog className="mr-1.5 h-4 w-4" /> Dados
              </Button>
            )}
          </div>
        </div>
      )}

      {!user && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <Button
            asChild
            className="btn-primary-glow rounded-full px-6 shadow-[var(--shadow-glow)]"
          >
            <Link to="/auth">Criar meu folio</Link>
          </Button>
        </div>
      )}

      {editingWidget && (
        <WidgetEditDialog
          open={!!editingWidget}
          onOpenChange={(v) => !v && setEditingWidget(null)}
          initial={editingWidget}
          onSave={handleSaveWidget}
          onDelete={
            editingWidget.id
              ? () => handleDeleteWidget(editingWidget.id!)
              : undefined
          }
        />
      )}

      {editingProfile && (
        <ProfileEditDialog
          open={editingProfile}
          onOpenChange={setEditingProfile}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
