"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Preencha email e senha");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Resposta login:", response.data);

      const token = response?.data?.token;

      if (!token) {
        alert("Token não retornado pelo backend");
        return;
      }

      // salva token
      localStorage.setItem("token", token);

      // redireciona
      router.push("/");

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-900 mb-8">
        YOUR ACCOUNT
      </h2>

      <form className="space-y-6" onSubmit={handleLogin}>
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            EMAIL
          </label>
          <input
            type="email"
            className="w-full border border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            PASSWORD
          </label>
          <input
            type="password"
            className="w-full border border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* BOTÃO LOGIN */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-3 mt-4 hover:bg-green-800 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "LOG IN"}
        </button>
      </form>

      {/* SIGN UP */}
      <div className="mt-8 text-sm text-green-900 flex justify-between">
        <span>DONT HAVE AN ACCOUNT?</span>
        <button
          type="button"
          className="underline"
          onClick={() => router.push("/register")}
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}
