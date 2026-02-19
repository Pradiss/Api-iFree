"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "../components/auth/LogoutButton";


export default function Home() {
  const router = useRouter()
  

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
  }
}, [router]);

  return (
    <div>
      <h1>Teste API</h1>

      <div>
        <LogoutButton />
      </div>
     
    </div>
  );
}
