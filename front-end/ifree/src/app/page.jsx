"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../components/auth/LogoutButton";

export default function Home() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileCompleted = localStorage.getItem("profileCompleted");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (profileCompleted !== "true") {
      router.replace("/complete-profile");
      return;
    }

    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">iFree 🎵</h1>
          <LogoutButton />
        </div>

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Bem vindo à plataforma
          </h2>
          <p className="text-gray-500 text-sm">
            Gerencie seu perfil, encontre músicos ou estabelecimentos.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4">

          <button
            onClick={() => router.push("/profile")}
            className="w-full bg-black text-white p-4 rounded-xl hover:opacity-90 transition"
          >
            Meu Perfil
          </button>

          <button
            onClick={() => router.push("/search")}
            className="w-full border p-4 rounded-xl hover:bg-gray-50 transition"
          >
            Procurar Músicos
          </button>

          <button
            onClick={() => router.push("/events")}
            className="w-full border p-4 rounded-xl hover:bg-gray-50 transition"
          >
            Eventos / Shows
          </button>

        </div>

      </div>

    </div>
  );
}