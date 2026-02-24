"use client";

import { useRouter } from "next/navigation";
import { api } from "../../services/api"

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
    >
      Logout
    </button>
  );
}
