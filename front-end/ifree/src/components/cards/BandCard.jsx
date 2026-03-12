"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BandCard({ b }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const bandName = b?.name || "Band";

  const imageUrl =
    b?.profile_image ||
    b?.profileImage ||
    "/avatar-default.png";

  return (
    <div
      onClick={() => router.push(`/band/${b.id}`)}
      className="flex-shrink-0 w-36 bg-white rounded-2xl border border-black/[0.07]
      overflow-hidden hover:border-gray-300 transition cursor-pointer"
    >
      <img
        src={imgError ? "/avatar-default.png" : imageUrl}
        alt={bandName}
        className="w-full h-28 object-cover"
        onError={() => setImgError(true)}
      />

      <div className="p-2.5">
        <p className="text-[13px] font-semibold text-gray-900 truncate">
          {bandName}
        </p>

        <p className="text-[11px] text-gray-400 truncate">
          {b?.city || "—"}
        </p>
      </div>
    </div>
  );
}