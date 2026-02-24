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

  console.log("TOKEN:", token);
  console.log("PROFILE:", profileCompleted);

  if (!token) {
    router.replace("/login");
    return;
  }

  if (!profileCompleted) {
    router.replace("/complete-profile");
    return;
  }

  setAuthorized(true);
}, [router]);

  if (!authorized) {
    return null; // NÃO renderiza nada até validar
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Teste API</h1>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}