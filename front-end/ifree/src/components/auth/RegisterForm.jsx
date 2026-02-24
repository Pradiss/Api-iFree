"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !role) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        role,
      });

      const { token, role: userRole } = response?.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      alert("Cadastro realizado e login efetuado!");
      router.push("/complete-profile");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao cadastrar");
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-900 mb-6">
        YOUR ACCOUNT
      </h2>

      {/* Barra de Progresso */}
      <div className="flex mb-8">
        <div
          className={`flex-1 h-2 rounded-l ${
            step >= 1 ? "bg-green-700" : "bg-gray-300"
          }`}
        />
        <div
          className={`flex-1 h-2 rounded-r ${
            step >= 2 ? "bg-green-700" : "bg-gray-300"
          }`}
        />
      </div>

      <form className="space-y-6" onSubmit={handleRegister}>
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                NAME
              </label>
              <input
                type="text"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!name || !email) {
                  alert("Preencha nome e email");
                  return;
                }
                setStep(2);
              }}
              className="w-full bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition"
            >
              Próximo
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Role
              </label>

              <div className="relative">
                <select
                  className="w-full appearance-none border border-gray-400 bg-transparent px-4 py-3 pr-10 rounded-md text-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800 transition"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Selecionar</option>
                  <option value="musician">Músico</option>
                  <option value="band">Banda</option>
                  <option value="establishment">Estabelecimento</option>
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-green-900">
                  ▼
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-green-900 underline"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition"
              >
                Cadastrar
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-8 text-sm text-green-900 flex justify-between">
        <span>Already have an account?</span>
        <button
          type="button"
          className="underline"
          onClick={() => router.push("/")}
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
}