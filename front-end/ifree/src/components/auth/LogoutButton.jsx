"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
