"use client";
import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Preencha email e senha");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      console.log("data completo:", response.data);

      const { token, role, profileCompleted } = response?.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("profileCompleted", profileCompleted);

      if (!token) {
        setErrorMessage("Token não retornado pelo backend");
        return;
      }

      if (!profileCompleted) {
        router.push("/complete-profile");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Credenciais inválidas. Verifique seu email e senha.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-900 mb-8">YOUR ACCOUNT</h2>

      <form className="space-y-6" onSubmit={handleLogin}>

        {errorMessage && (
          <div className="p-1  text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            EMAIL
          </label>
          <input
            type="email"
            className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-green-900 mb-2">
            PASSWORD
          </label>
          <input
            type="password"
            className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>


        <button
          type="submit"
          className="bg-green-700 rounded-md text-white px-7 py-3 mt-4 hover:bg-green-800 transition disabled:opacity-50"
        >
          Login
        </button>
      </form>

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