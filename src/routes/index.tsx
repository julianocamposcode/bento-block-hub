import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Grid3x3, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NoCode Folio — Seu link-in-bio em formato Bento" },
      {
        name: "description",
        content:
          "Crie uma página de perfil modular em Bento Grid. Glassmorphism dark, blocos arrastáveis, links sociais e showcase de projetos.",
      },
      { property: "og:title", content: "NoCode Folio" },
      {
        property: "og:description",
        content: "Link-in-Bio estilo Bento Grid com design imersivo dark.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id;
      if (!uid) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", uid)
        .maybeSingle();
      if (!cancelled && p?.username) setUsername(p.username);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl btn-primary-glow">
            <Grid3x3 className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">NoCode Folio</span>
        </Link>
        <nav className="flex items-center gap-2">
          {username ? (
            <Button
              onClick={() => navigate({ to: "/$username", params: { username } })}
              className="btn-primary-glow rounded-full px-5"
            >
              Meu perfil
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild className="btn-primary-glow rounded-full px-5">
                <Link to="/auth">Começar</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="mx-auto max-w-3xl pt-16 pb-12 text-center sm:pt-24 sm:pb-20">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Glassmorphism Dark · Bento Grid
          </div>
          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Seu link-in-bio,{" "}
            <span className="text-gradient">em blocos</span> que contam quem você é.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Monte um perfil modular estilo Bento — arraste, redimensione e
            personalize cada bloco. Compartilhe uma única URL.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="btn-primary-glow rounded-full px-7 text-base"
            >
              <Link to="/auth">
                Criar meu folio <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <Link to="/$username" params={{ username: "demo" }}>
                Ver exemplo →
              </Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 pb-24 md:grid-cols-3">
          {[
            {
              icon: Grid3x3,
              title: "Bento Grid",
              desc: "Blocos de 1x1, 2x1 e 2x2 que se rearranjam em mobile, tablet e desktop.",
            },
            {
              icon: Sparkles,
              title: "Glass Dark",
              desc: "Backdrop blur, bordas glow violeta e gradientes radiais sutis.",
            },
            {
              icon: Zap,
              title: "Modo Criador",
              desc: "Arraste, edite e exclua em tempo real. Compartilhe a URL pública.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="glass-card glass-card-hover animate-bento-in p-6"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
