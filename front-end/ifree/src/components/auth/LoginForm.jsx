"use client";
import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const emailActive = emailFocused || email.length > 0;
  const passActive = passFocused || password.length > 0;

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("profileCompleted", data.profileCompleted);

      if (data.profileCompleted) {
        router.push("/");
      } else {
        router.push("/complete-profile");
      }
    } catch {
      setError("Wrong email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full" style={{ fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>

     
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-gray-400 mb-2 sm:mb-3">
          BandLink
        </p>
        <h1 className="text-[26px] font-semibold tracking-tight text-gray-900 sm:text-[32px]">
          Sign in
        </h1>
        <p className="mt-1 text-[13px] font-light text-gray-400 sm:mt-1.5 sm:text-[14px]">
          Welcome back to BandLink.
        </p>
      </div>

    
      <form onSubmit={handleLogin} className="flex flex-col gap-3">

       
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            required
            className={`
              w-full h-[50px] sm:h-[52px] rounded-xl border outline-none
              pl-4 pr-11 text-[15px] text-gray-900
              bg-black/[0.03] transition-all duration-200
              ${emailFocused ? "border-gray-400" : "border-black/10"}
              ${emailActive ? "pt-5 pb-1" : ""}
            `}
          />
          <label className={`
            absolute left-4 pointer-events-none transition-all duration-200
            ${emailActive
              ? "top-1.5 text-[10px] font-semibold tracking-widest uppercase"
              : "top-1/2 -translate-y-1/2 text-[14px] font-normal"
            }
            ${emailFocused ? "text-gray-500" : "text-gray-400"}
          `}>
            Email
          </label>
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
          </span>
        </div>

        
        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              required
              className={`
                w-full h-[50px] sm:h-[52px] rounded-xl border outline-none
                pl-4 pr-11 text-[15px] text-gray-900
                bg-black/[0.03] transition-all duration-200
                ${error ? "border-red-400" : passFocused ? "border-gray-400" : "border-black/10"}
                ${passActive ? "pt-5 pb-1" : ""}
              `}
            />
            <label className={`
              absolute left-4 pointer-events-none transition-all duration-200
              ${passActive
                ? "top-1.5 text-[10px] font-semibold tracking-widest uppercase"
                : "top-1/2 -translate-y-1/2 text-[14px] font-normal"
              }
              ${error ? "text-red-400" : passFocused ? "text-gray-500" : "text-gray-400"}
            `}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {showPass ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-[12px] mt-1.5 pl-1">{error}</p>
          )}
        </div>

      
        <div className="flex justify-end">
          <button type="button" className="text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
            Forgot password?
          </button>
        </div>

     
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[50px] sm:h-[52px] rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-1"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            "Continue"
          )}
        </button>
      </form>

   
      <div className="flex items-center gap-3 text-[11px] font-medium tracking-widest uppercase text-gray-300 my-5 sm:my-6">
        <span className="flex-1 h-px bg-black/[0.07]" />
        or
        <span className="flex-1 h-px bg-black/[0.07]" />
      </div>

 
      <button
        type="button"
        className="w-full h-[50px] sm:h-[52px] rounded-xl border border-black/10 hover:bg-black/[0.03] font-medium text-[14px] text-gray-700 flex items-center justify-center gap-3 transition-all duration-200"
      >
        <svg width="17" height="17" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      
      <p className="text-[13px] text-gray-400 text-center mt-6 sm:mt-7">
        Do not have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="font-semibold text-gray-700 bg-transparent border-none hover:underline"
        >
          Sign up
        </button>
      </p>

    </div>
  );
}