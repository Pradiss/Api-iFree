"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import LogoutButton from "../components/auth/LogoutButton";

function MusicianCard({ m }) {
  const [imgError, setImgError] = useState(false);

  // tenta diferentes nomes de campo que o backend pode retornar
  const imageUrl = m.profile_image || m.profileImage || m.photo || m.avatar || null;
  const showImage = imageUrl && !imgError;

  return (
    <div className="flex-shrink-0 w-36 bg-white rounded-2xl border border-black/[0.07] overflow-hidden hover:border-gray-300 transition cursor-pointer">
      {showImage ? (
        <img
          src={imageUrl}
          alt={m.name_artistic}
          className="w-full h-28 object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-3xl">🎵</div>
      )}
      <div className="p-2.5">
        <p className="text-[13px] font-semibold text-gray-900 truncate">{m.name_artistic}</p>
        <p className="text-[11px] text-gray-400 truncate">{m.city || "—"}</p>
      </div>
    </div>
  );
}

function HorizontalScroll({ title, items, renderItem }) {
  const ref = useRef(null);

  function scroll(dir) {
    ref.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[13px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:border-gray-400 transition">‹</button>
          <button onClick={() => scroll(1)} className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:border-gray-400 transition">›</button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map(renderItem)}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [musicians, setMusicians] = useState([]);
  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileCompleted = localStorage.getItem("profileCompleted");

    if (!token) { router.push("/login"); return; }
    if (profileCompleted !== "true") { router.replace("/complete-profile"); return; }

    setAuthorized(true);

    Promise.all([
      api.get("v1/musician"),
      api.get("v1/genre"),
      api.get("v1/instrument"),
    ]).then(([m, g, i]) => {
      setMusicians(m.data || []);
      setGenres(g.data || []);
      setInstruments(i.data || []);

      // debug: veja no console o que o backend retorna para saber o nome exato do campo
      if (m.data?.length > 0) {
        console.log("Campos do músico:", Object.keys(m.data[0]));
        console.log("Exemplo de músico:", m.data[0]);
      }
    });
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-0.5">BandLink</p>
            <h1 className="text-[22px] font-semibold text-gray-900">Explore</h1>
          </div>
          <LogoutButton />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Meu Perfil", icon: "👤", path: "/profile" },
            { label: "Buscar", icon: "🔍", path: "/search" },
            { label: "Eventos", icon: "🎪", path: "/events" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="bg-white border border-black/[0.07] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-gray-300 transition"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[12px] font-medium text-gray-600">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Músicos */}
        <HorizontalScroll
          title="Músicos"
          items={musicians}
          renderItem={(m) => <MusicianCard key={m.id} m={m} />}
        />

        {/* Gêneros */}
        <HorizontalScroll
          title="Gêneros"
          items={genres}
          renderItem={(g) => (
            <div
              key={g.id}
              className="flex-shrink-0 px-4 py-2.5 bg-white border border-black/[0.07] rounded-xl hover:border-gray-300 transition cursor-pointer"
            >
              <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">{g.name}</span>
            </div>
          )}
        />

        {/* Instrumentos */}
        <HorizontalScroll
          title="Instrumentos"
          items={instruments}
          renderItem={(i) => (
            <div
              key={i.id}
              className="flex-shrink-0 px-4 py-2.5 bg-white border border-black/[0.07] rounded-xl hover:border-gray-300 transition cursor-pointer"
            >
              <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">{i.name}</span>
            </div>
          )}
        />

      </div>
    </div>
  );
}