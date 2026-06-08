import type { Widget, WidgetSize } from "@/lib/types";
import type { Profile } from "@/lib/types";
import {
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Twitter,
  Globe,
  MapPin,
  Mail,
  ExternalLink,
  Music2,
  ImageIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SIZE_CLASSES: Record<WidgetSize, string> = {
  "1x1": "col-span-1 row-span-1 sm:col-span-1 md:col-span-1 aspect-square",
  "2x1": "col-span-1 row-span-1 sm:col-span-2 md:col-span-2 aspect-[2/1]",
  "1x2": "col-span-1 row-span-2 sm:col-span-1 md:col-span-1 aspect-[1/2]",
  "2x2": "col-span-1 row-span-2 sm:col-span-2 md:col-span-2 aspect-square",
};

const SOCIAL_ICONS = {
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Music2,
  website: Globe,
};
const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  twitter: "Twitter",
  tiktok: "TikTok",
  website: "Website",
};

export function WidgetContent({
  widget,
  profile,
}: {
  widget: Widget;
  profile: Profile;
}) {
  const { type, content } = widget;

  if (type === "profile") {
    const initials = (profile.full_name || profile.username || "?")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div className="flex h-full flex-col gap-4 p-6">
        <Avatar className="h-20 w-20 rounded-2xl ring-2 ring-primary/40 ring-offset-2 ring-offset-background">
          <AvatarImage src={profile.avatar_url ?? undefined} />
          <AvatarFallback className="rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-xl font-bold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-tight">
            {profile.full_name || profile.username}
          </h2>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {profile.bio}
            </p>
          )}
        </div>
        {profile.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full bg-primary/15 text-xs font-medium text-primary hover:bg-primary/25"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "social") {
    const platform = (content.platform ?? "website") as keyof typeof SOCIAL_ICONS;
    const Icon = SOCIAL_ICONS[platform] ?? Globe;
    return (
      <a
        href={content.url || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center"
        onClick={(e) => !content.url && e.preventDefault()}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {SOCIAL_LABELS[platform] ?? platform}
        </span>
      </a>
    );
  }

  if (type === "link") {
    return (
      <a
        href={content.url || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex h-full flex-col justify-between gap-3 p-5"
        onClick={(e) => !content.url && e.preventDefault()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <ExternalLink className="h-5 w-5" />
          </div>
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight">
            {content.title || "Meu link"}
          </h3>
          {content.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {content.description}
            </p>
          )}
        </div>
      </a>
    );
  }

  if (type === "showcase") {
    return (
      <a
        href={content.url || "#"}
        target={content.url ? "_blank" : undefined}
        rel="noreferrer"
        className="relative flex h-full w-full overflow-hidden"
        onClick={(e) => !content.url && e.preventDefault()}
      >
        {content.image_url ? (
          <img
            src={content.image_url}
            alt={content.title || "Showcase"}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 to-primary-glow/10">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        <div className="relative z-10 flex h-full w-full flex-col justify-end p-5">
          <h3 className="text-lg font-bold leading-tight">
            {content.title || "Projeto em destaque"}
          </h3>
          {content.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {content.description}
            </p>
          )}
        </div>
      </a>
    );
  }

  if (type === "newsletter") {
    return (
      <div className="flex h-full flex-col justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-tight">
              {content.heading || "Receba novidades"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {content.description || "Newsletter quinzenal"}
            </p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const em = fd.get("email");
            alert(`Obrigado! Inscreveremos ${em}`);
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="flex gap-2"
        >
          <Input
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="h-10 flex-1 rounded-full border-glass-border bg-background/60 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            className="btn-primary-glow h-10 rounded-full px-4 text-sm"
          >
            {content.cta || "Assinar"}
          </Button>
        </form>
      </div>
    );
  }

  if (type === "map") {
    const loc = content.location || profile.location || "Brasil";
    const q = encodeURIComponent(loc);
    return (
      <a
        href={`https://www.google.com/maps?q=${q}`}
        target="_blank"
        rel="noreferrer"
        className="relative flex h-full w-full overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, oklch(0.35 0.08 280) 0%, transparent 40%),
              radial-gradient(circle at 70% 60%, oklch(0.3 0.06 260) 0%, transparent 45%),
              linear-gradient(135deg, oklch(0.18 0.03 265), oklch(0.22 0.04 270))
            `,
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q25,30 50,55 T100,40"
            stroke="oklch(0.5 0.1 270)"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M0,70 Q40,55 60,75 T100,65"
            stroke="oklch(0.5 0.1 270)"
            strokeWidth="0.5"
            fill="none"
          />
          <path
            d="M20,0 L25,100"
            stroke="oklch(0.4 0.08 270)"
            strokeWidth="0.3"
            fill="none"
          />
          <path
            d="M70,0 L65,100"
            stroke="oklch(0.4 0.08 270)"
            strokeWidth="0.3"
            fill="none"
          />
        </svg>
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-foreground">{loc}</span>
        </div>
      </a>
    );
  }

  if (type === "text") {
    return (
      <div className="flex h-full flex-col justify-center gap-2 p-6">
        {content.heading && (
          <h3 className="text-lg font-bold leading-tight">{content.heading}</h3>
        )}
        <p className="text-sm leading-relaxed text-foreground/85">
          {content.body || "Adicione uma mensagem aqui."}
        </p>
      </div>
    );
  }

  return null;
}
