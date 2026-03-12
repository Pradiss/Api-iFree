"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MusicianCard({ m }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const imageUrl =
    m.profile_image ||
    m.profileImage ||
    m.photo ||
    m.avatar ||
    null;

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    m.name_artistic || "Musician"
  )}`;

  return (
    <div
      onClick={() => router.push(`/musician/${m.id}`)}
      className="flex-shrink-0 w-36 bg-white rounded-2xl border border-black/[0.07]
      overflow-hidden hover:border-gray-300 transition cursor-pointer"
    >
      <img
        src={!imgError && imageUrl ? imageUrl : fallback}
        alt={m.name_artistic}
        className="w-full h-28 object-cover"
        onError={() => setImgError(true)}
      />

      <div className="p-2.5">
        <p className="text-[13px] font-semibold text-gray-900 truncate">
          {m.name_artistic}
        </p>

        <p className="text-[11px] text-gray-400 truncate">
          {m.city || "—"}
        </p>
      </div>
    </div>
  );
}