"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { api } from "../../services/api";

const TOTAL_STEPS = 3;

const SKILL_OPTIONS = [
  { value: "instrumentalist", label: "🎸 Instrumentista" },
  { value: "vocalist", label: "🎤 Vocalista" },
  { value: "dj", label: "🎧 DJ" },
];

const INITIAL_FORM = {
  name_artistic: "",
  city: "",
  experience_years: "",
  profile_image: "",
  genre_ids: [],
  instrument_ids: [],
  skills: [],
};

function FloatingInput({ label, name, value, onChange, type = "text", min }) {
  const [focused, setFocused] = useState(false);
  const active = focused || String(value).length > 0;

  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full h-[52px] rounded-xl border outline-none
          pl-4 pr-4 text-[15px] text-gray-900
          bg-black/[0.02] transition-all duration-200
          ${focused ? "border-gray-400 bg-white" : "border-black/10"}
          ${active ? "pt-5 pb-1" : ""}
        `}
      />
      <label
        htmlFor={name}
        className={`
          absolute left-4 pointer-events-none transition-all duration-200
          ${
            active
              ? "top-1.5 text-[10px] font-semibold tracking-widest uppercase"
              : "top-1/2 -translate-y-1/2 text-[14px] font-normal"
          }
          ${focused ? "text-gray-500" : "text-gray-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
}

function TagButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-[13px] font-medium transition ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-black/10 bg-black/[0.02] text-gray-600 hover:border-gray-400 hover:bg-black/[0.04]"
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({
  children,
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
}) {
  const baseClass =
    "h-[52px] rounded-xl px-5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-gray-900 text-white hover:bg-black",
    secondary:
      "border border-black/10 bg-white text-gray-700 hover:border-gray-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function ProgressBar({ currentStep }) {
  return (
    <div className="mb-8 flex gap-1.5">
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <div
          key={index}
          className={`h-[3px] flex-1 rounded-full transition ${
            currentStep >= index + 1 ? "bg-gray-900" : "bg-black/10"
          }`}
        />
      ))}
    </div>
  );
}

function Message({ type = "error", children }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-600",
    success: "border-green-200 bg-green-50 text-green-700",
  };

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </p>
  );
}

export default function MusicianForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);

  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [userName, setUserName] = useState("");

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    loadInitialData();
  }, [router]);

  const loadInitialData = async () => {
    try {
      setLoadingOptions(true);
      setError("");

      const [genresResponse, instrumentsResponse, meResponse] =
        await Promise.all([
          api.get("/v1/genre"),
          api.get("/v1/instrument"),
          api.get("/v1/auth/me"),
        ]);

      setGenres(genresResponse.data || []);
      setInstruments(instrumentsResponse.data || []);
      setUserName(meResponse.data?.name || "");
    } catch (err) {
      setError("Falha ao carregar os dados do perfil.");
    } finally {
      setLoadingOptions(false);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const isStepOneValid = useMemo(() => {
    return form.name_artistic.trim() !== "" && form.city.trim() !== "";
  }, [form.name_artistic, form.city]);

  const isStepTwoValid = useMemo(() => {
    return form.skills.length > 0 && form.genre_ids.length > 0;
  }, [form.skills, form.genre_ids]);

  const updateFormField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleArrayField = (field, value) => {
    setForm((prev) => {
      const currentValues = prev[field];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [field]: isSelected
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    setError("");
    setSuccess("");

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const getStepValidationError = () => {
    if (step === 1 && !isStepOneValid) {
      return "Preencha seu nome artístico e cidade.";
    }

    if (step === 2) {
      if (form.skills.length === 0)
        return "Selecione pelo menos uma habilidade.";
      if (form.genre_ids.length === 0) return "Selecione pelo menos um gênero.";
    }

    return "";
  };

  const handleNextStep = () => {
    const validationError = getStepValidationError();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handlePreviousStep = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const createCroppedImageBlob = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context)
      throw new Error("Não foi possível criar o contexto do canvas.");

    const { x, y, width, height } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Falha ao gerar a imagem recortada."));
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const uploadProfileImage = async () => {
    const blob = await createCroppedImageBlob();

    if (!blob) return form.profile_image;

    const formData = new FormData();
    formData.append("image", blob, "profile.jpg");

    const response = await api.post("/v1/musician/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data?.url || "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      let profileImage = form.profile_image;

      if (imageSrc && croppedAreaPixels) {
        profileImage = await uploadProfileImage();
      }

      await api.post("/v1/musician", {
        ...form,
        experience_years: Number(form.experience_years) || 0,
        profile_image: profileImage,
      });

      localStorage.setItem("profileCompleted", "true");
      setSuccess("Perfil salvo com sucesso.");

      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Erro ao salvar o perfil.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <header className="mb-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
          BandLink
        </p>

        <h1 className="text-[28px] font-semibold tracking-tight text-gray-900">
          Cadastrando Músico <br></br><span className="text-red-700">{userName}</span>
        </h1>

        <p className="text-[13px] text-gray-400">
          Etapa {step} de {TOTAL_STEPS}
        </p>
      </header>

      <ProgressBar currentStep={step} />

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {step === 1 && (
          <>
            <FloatingInput
              label="Nome artístico"
              name="name_artistic"
              value={form.name_artistic}
              onChange={updateFormField}
            />

            <FloatingInput
              label="Cidade"
              name="city"
              value={form.city}
              onChange={updateFormField}
            />

            <ActionButton
              onClick={handleNextStep}
              disabled={!isStepOneValid}
              className="w-full mt-1"
            >
              Próximo
            </ActionButton>
          </>
        )}

        {step === 2 && (
          <>
            <section className="space-y-3">
              <SectionLabel>Eu sou...</SectionLabel>

              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <TagButton
                    key={skill.value}
                    label={skill.label}
                    active={form.skills.includes(skill.value)}
                    onClick={() => toggleArrayField("skills", skill.value)}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <SectionLabel>Instrumentos (opcional)</SectionLabel>

              <div className="flex flex-wrap gap-2">
                {loadingOptions ? (
                  <p className="text-sm text-gray-400">
                    Carregando instrumentos...
                  </p>
                ) : (
                  instruments.map((instrument) => (
                    <TagButton
                      key={instrument.id}
                      label={instrument.name}
                      active={form.instrument_ids.includes(instrument.id)}
                      onClick={() =>
                        toggleArrayField("instrument_ids", instrument.id)
                      }
                    />
                  ))
                )}
              </div>
            </section>

            <section className="space-y-3">
              <SectionLabel>Gêneros</SectionLabel>

              <div className="flex flex-wrap gap-2">
                {loadingOptions ? (
                  <p className="text-sm text-gray-400">Carregando gêneros...</p>
                ) : (
                  genres.map((genre) => (
                    <TagButton
                      key={genre.id}
                      label={genre.name}
                      active={form.genre_ids.includes(genre.id)}
                      onClick={() => toggleArrayField("genre_ids", genre.id)}
                    />
                  ))
                )}
              </div>
            </section>

            <FloatingInput
              label="Anos de experiência"
              name="experience_years"
              type="number"
              min={0}
              value={form.experience_years}
              onChange={updateFormField}
            />

            <div className="flex gap-3 mt-1">
              <ActionButton
                variant="secondary"
                onClick={handlePreviousStep}
                className="min-w-[120px]"
              >
                Voltar
              </ActionButton>

              <ActionButton
                onClick={handleNextStep}
                disabled={!isStepTwoValid}
                className="flex-1"
              >
                Próximo
              </ActionButton>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {!imageSrc ? (
              <label className="relative mx-auto flex h-40 w-40 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-black/10 bg-black/[0.02] text-center text-sm text-gray-500 transition hover:border-gray-400 hover:bg-black/[0.04]">
                <span className="px-4">Clique para enviar foto de perfil</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0"
                />
              </label>
            ) : (
              <>
                <div className="relative h-64 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                {/* Botão trocar foto */}
                <label className="mx-auto flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Trocar foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </>
            )}

            {imageSrc && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Zoom
                </p>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex gap-3 mt-1">
              <ActionButton
                variant="secondary"
                onClick={handlePreviousStep}
                className="min-w-[120px]"
              >
                Voltar
              </ActionButton>

              <ActionButton
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Salvando..." : "Salvar perfil"}
              </ActionButton>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
