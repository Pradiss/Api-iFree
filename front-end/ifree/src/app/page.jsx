"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

import LogoutButton from "../components/auth/LogoutButton";
import MusicianCard from "../components/cards/MusicianCard";
import BandCard from "../components/cards/BandCard";

function HorizontalScroll({ title, items, renderItem }) {
  const ref = useRef(null);

  function scroll(dir) {
    ref.current?.scrollBy({
      left: dir * 220,
      behavior: "smooth",
    });
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[13px] font-semibold tracking-widest uppercase text-gray-400">
          {title}
        </h3>

        <div className="flex gap-1">
          <button
            onClick={() => scroll(-1)}
            className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:border-gray-400 transition"
          >
            ‹
          </button>

          <button
            onClick={() => scroll(1)}
            className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-gray-400 hover:border-gray-400 transition"
          >
            ›
          </button>
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
  const [bands, setBands] = useState([]);
  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileCompleted = localStorage.getItem("profileCompleted");

    if (!token) {
      router.push("/login");
      return;
    }

    if (profileCompleted !== "true") {
      router.replace("/complete-profile");
      return;
    }

    setAuthorized(true);

    Promise.all([
      api.get("v1/musician"),
      api.get("v1/band"),
      api.get("v1/genre"),
      api.get("v1/instrument"),
    ]).then(([m, b, g, i]) => {
      setMusicians(m.data || []);
      setBands(b.data || []);
      setGenres(g.data || []);
      setInstruments(i.data || []);
    });
  }, [router]);

  if (!authorized) return null;

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-5 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-0.5">
              BandLink
            </p>

            <h1 className="text-[22px] font-semibold text-gray-900">
              Explore
            </h1>
          </div>

          <LogoutButton />
        </div>

        {/* QUICK ACTIONS */}
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

              <span className="text-[12px] font-medium text-gray-600">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* MÚSICOS */}
        <HorizontalScroll
          title="Músicos"
          items={musicians}
          renderItem={(m) => (
            <MusicianCard key={m.id} m={m} />
          )}
        />

        {/* BANDAS */}
        <HorizontalScroll
          title="Bandas"
          items={bands}
          renderItem={(b) => (
            <BandCard key={b.id} b={b} />
          )}
        />

        {/* GÊNEROS */}
        <HorizontalScroll
          title="Gêneros"
          items={genres}
          renderItem={(g) => (
            <div
              key={g.id}
              onClick={() => router.push(`/genre/${g.id}`)}
              className="flex-shrink-0 px-4 py-2.5 bg-white border border-black/[0.07] rounded-xl hover:border-gray-300 transition cursor-pointer"
            >
              <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">
                {g.name}
              </span>
            </div>
          )}
        />

        {/* INSTRUMENTOS */}
        <HorizontalScroll
          title="Instrumentos"
          items={instruments}
          renderItem={(i) => (
            <div
              key={i.id}
              onClick={() => router.push(`/instrument/${i.id}`)}
              className="flex-shrink-0 px-4 py-2.5 bg-white border border-black/[0.07] rounded-xl hover:border-gray-300 transition cursor-pointer"
            >
              <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">
                {i.name}
              </span>
            </div>
          )}
        />

      </div>
    </div>
  );
}