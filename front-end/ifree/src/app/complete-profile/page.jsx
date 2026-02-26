"use client";

import { useEffect, useState } from "react";
import MusicianForm from "../../components/auth/MusicianForm";
import BandForm from "../../components/auth/BandForm";
import EstablishmentForm from "../../components/auth/EstablishmentForm";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole) {
      router.push("/register");
      return;
    }
    if (!["musician", "band", "establishment"].includes(storedRole)) {
      localStorage.removeItem("role");
      router.push("/register");
      return;
    }
    setRole(storedRole);
  }, [router]);

  if (!role) return null;

  const roleTitle = {
    musician: "MUSICIAN",
    band: "BAND",
    establishment: "ESTABLISHMENT",
  };

  const roleDescription = {
    musician: "Tell us about your musical journey and showcase your talent.",
    band: "Introduce your band and let venues and fans discover you.",
    establishment: "Present your venue and connect with artists.",
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SIDE — igual ao Register */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-green-900 to-black text-white flex flex-col justify-center p-12">
        <span className="italic text-lg">Complete Profile</span>
        <h1 className="text-7xl font-extrabold leading-tight">
          {roleTitle[role]} <br /> PROFILE
        </h1>
        <p className="mt-6 text-sm text-gray-300 max-w-sm">
          {roleDescription[role]}
        </p>
      </div>

      {/* RIGHT SIDE — igual ao Register */}
      <div className="md:w-1/2 w-full bg-[#e8dccc] flex items-center justify-center p-12">
        {role === "musician" && <MusicianForm />}
        {role === "band" && <BandForm />}
        {role === "establishment" && <EstablishmentForm />}
      </div>
    </div>
  );
}