import Image from "next/image";
import { profile } from "@/data/profile";

// Shows profile.photo when set, otherwise a monogram. See src/data/profile.ts.
export function Avatar({ size = 64 }: { size?: number }) {
  return (
    <div className="avatar-ring shrink-0 rounded-full p-[2px]" style={{ width: size, height: size }}>
      <div className="grid size-full place-items-center overflow-hidden rounded-full bg-surface">
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={profile.name}
            width={size * 2}
            height={size * 2}
            className="size-full object-cover"
            priority
          />
        ) : (
          <span className="font-mono font-semibold text-gradient" style={{ fontSize: size * 0.34 }}>
            {profile.initials}
          </span>
        )}
      </div>
    </div>
  );
}
