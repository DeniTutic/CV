import { Plane } from "lucide-react";
import { profile } from "@/data/profile";

export function Relocation({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-center gap-1.5 font-mono text-xs text-fg-soft ${className}`}>
      <Plane className="size-3.5 shrink-0 text-ok" />
      Relocating to {profile.movingTo}
    </p>
  );
}
