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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const nameActive = nameFocused || name.length > 0;
  const emailActive = emailFocused || email.length > 0;
  const passActive = passFocused || password.length > 0;

  function goToStep2() {
    if (!name.trim() || !email.trim()) {
      setError("Preencha seu nome e e-mail.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Digite um e-mail válido.");
      return;
    }
    setError("");
    setStep(2);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      goToStep2();
      return;
    }
    handleRegister();
  }

  async function handleRegister() {
    if (!password || !role) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 8 || !/[A-Z]/.test(password)) {
      setError(
        "A senha deve ter pelo menos 8 caracteres e uma letra maiúscula.",
      );
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/v1/auth/register", {
        email,
        password,
        name,
        role,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("profileCompleted", "false");

      router.push("/complete-profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Falha no cadastro. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (focused, hasError, active) => `
    w-full h-[50px] sm:h-[52px] rounded-xl border outline-none
    pl-4 pr-4 text-[15px] text-gray-900
    bg-black/[0.03] transition-all duration-200
    ${hasError ? "border-red-400" : focused ? "border-gray-400" : "border-black/10"}
    ${active ? "pt-5 pb-1" : ""}
  `;

  const labelCls = (active, focused, hasError) => `
    absolute left-4 pointer-events-none transition-all duration-200
    ${active ? "top-1.5 text-[10px] font-semibold tracking-widest uppercase" : "top-1/2 -translate-y-1/2 text-[14px] font-normal"}
    ${hasError ? "text-red-400" : focused ? "text-gray-500" : "text-gray-400"}
  `;

  const hasPasswordError =
    !!error &&
    step === 2 &&
    (!password || password.length < 6 || !/[A-Z]/.test(password));
  const hasRoleError = !!error && step === 2 && !role;

  return (
    <div
      className="w-full"
      style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}
    >
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3">
          BandLink
        </p>
        <h1 className="text-[26px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
          Criar conta
        </h1>
        <p className="mt-1 text-[13px] font-light text-gray-400 sm:mt-1.5 sm:text-[14px]">
          Etapa {step} de 2
        </p>
      </div>

      <div className="flex gap-1.5 mb-6 sm:mb-8">
        <div
          className={`flex-1 h-[3px] rounded-full transition-colors duration-300 ${step >= 1 ? "bg-gray-900" : "bg-black/10"}`}
        />
        <div
          className={`flex-1 h-[3px] rounded-full transition-colors duration-300 ${step >= 2 ? "bg-gray-900" : "bg-black/10"}`}
        />
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
        {step === 1 && (
          <>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoComplete="name"
                className={inputCls(nameFocused, false, nameActive)}
              />
              <label className={labelCls(nameActive, nameFocused, false)}>
                Nome
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoComplete="email"
                className={inputCls(emailFocused, false, emailActive)}
              />
              <label className={labelCls(emailActive, emailFocused, false)}>
                E-mail
              </label>
            </div>

            {error && <p className="text-red-400 text-[12px] pl-1">{error}</p>}

            <button
              type="submit"
              className="w-full h-[50px] sm:h-[52px] rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-[15px] flex items-center justify-center transition-all duration-200 mt-1"
            >
              Próximo
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  autoComplete="new-password"
                  className={
                    inputCls(passFocused, hasPasswordError, passActive) +
                    " pr-11"
                  }
                />
                <label
                  className={labelCls(
                    passActive,
                    passFocused,
                    hasPasswordError,
                  )}
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPass ? (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`
                  w-full h-[50px] sm:h-[52px] rounded-xl border outline-none
                  pl-4 pr-10 text-[15px] appearance-none
                  bg-black/[0.03] transition-all duration-200
                  ${hasRoleError ? "border-red-400 text-gray-400" : role ? "text-gray-900 border-black/10" : "text-gray-400 border-black/10"}
                `}
              >
                <option value="" disabled hidden>
                  Selecione seu perfil
                </option>
                <option value="musician">Músico</option>
                <option value="band">Banda</option>
                <option value="establishment">Estabelecimento</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[11px]">
                ▼
              </span>
            </div>

            {error && <p className="text-red-400 text-[12px] pl-1">{error}</p>}

            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="h-[50px] sm:h-[52px] px-5 rounded-xl border border-black/10 hover:bg-black/[0.03] font-medium text-[14px] text-gray-600 transition-all duration-200"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[50px] sm:h-[52px] rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="text-[13px] text-gray-400 text-center mt-6 sm:mt-7">
        Já tem uma conta?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-gray-700 bg-transparent border-none hover:underline"
        >
          Entrar
        </button>
      </p>
    </div>
  );
}
