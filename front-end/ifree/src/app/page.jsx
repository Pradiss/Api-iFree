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
    <div className="p-10">
      <h1 className="text-3xl font-bold">Teste API</h1>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}