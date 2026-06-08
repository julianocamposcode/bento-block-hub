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
import { useState } from "react";
import type { Profile } from "@/lib/types";

export function ProfileEditDialog({
  open,
  onOpenChange,
  profile,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  profile: Profile;
  onSave: (p: Partial<Profile>) => void;
}) {
  const [full_name, setFullName] = useState(profile.full_name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar_url, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [tags, setTags] = useState(profile.tags.join(", "));
  const [location, setLocation] = useState(profile.location ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md border-glass-border">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nome completo</Label>
            <Input
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 bg-glass"
            />
          </div>
          <div>
            <Label>Username (URL única)</Label>
            <Input
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                )
              }
              className="mt-1.5 bg-glass"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              nocodefolio.app/{username || "seu-nome"}
            </p>
          </div>
          <div>
            <Label>Bio curta</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1.5 bg-glass"
            />
          </div>
          <div>
            <Label>Avatar (URL)</Label>
            <Input
              value={avatar_url}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1.5 bg-glass"
            />
          </div>
          <div>
            <Label>Skills (vírgulas)</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Bubble, React, Figma"
              className="mt-1.5 bg-glass"
            />
          </div>
          <div>
            <Label>Localização</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="São Paulo, Brasil"
              className="mt-1.5 bg-glass"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() =>
              onSave({
                full_name,
                username,
                bio,
                avatar_url: avatar_url || null,
                tags: tags
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                location: location || null,
              })
            }
            className="btn-primary-glow w-full rounded-full"
          >
            Salvar perfil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
