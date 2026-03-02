"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

const TOTAL_STEPS = 3;

export default function MusicianForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [formData, setFormData] = useState({
    name_artistic: "",
    city: "",
    experience_years: 0,
    profile_image: "",
    genre_ids: [],
    instrument_ids: [],
  });

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Proteção de rota
  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");
  }, []);

 
  useEffect(() => {
    Promise.all([api.get("/genre"), api.get("/instrument")])
      .then(([genresRes, instrumentsRes]) => {
        setGenres(genresRes.data || []);
        setInstruments(instrumentsRes.data || []);
      })
      .catch(console.error);
  }, []);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience_years" ? parseInt(value) || 0 : value,
    }));

  const handleToggleId = (field, id) =>
    setFormData((prev) => {
      const ids = prev[field];
      return {
        ...prev,
        [field]: ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
      };
    });

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = ({ target: { files } }) => {
    if (!files?.length) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(files[0]);
  };

  const getCroppedBlob = async () => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = image;
    await new Promise((res) => (img.onload = res));
    const ctx = canvas.getContext("2d");
    const { x, y, width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    return new Promise((res) => canvas.toBlob(res, "image/jpeg"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      let profile_image = formData.profile_image;

      if (image && croppedAreaPixels) {
        const blob = await getCroppedBlob();
        const uploadData = new FormData();
        uploadData.append("image", blob, "profile.jpg");
        const { data } = await api.post("/media/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profile_image = data.url;
      }

      await api.post("/musician", { ...formData, profile_image });

      localStorage.setItem("profileCompleted", "true");
      setSuccessMessage("Perfil cadastrado com sucesso! Redirecionando...");
      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Erro ao salvar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setErrorMessage("");
    if (step === 1 && (!formData.name_artistic || !formData.city)) {
      return setErrorMessage("Preencha o nome artístico e a cidade");
    }
    if (step === 2) {
      if (formData.experience_years < 0)
        return setErrorMessage("Anos de experiência não pode ser negativo");
      if (!formData.genre_ids.length || !formData.instrument_ids.length)
        return setErrorMessage("Selecione pelo menos um gênero e um instrumento");
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setStep((s) => s - 1);
  };

  // Componente de botão de tag reutilizável
  const TagButton = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border ${
        active
          ? "bg-green-700 border-green-700 text-white"
          : "border-gray-400 text-green-900 hover:border-green-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-900 mb-6">MUSICIAN PROFILE</h2>

      {/* Barra de Progresso */}
      <div className="flex mb-8 gap-1">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 ${i === 0 ? "rounded-l" : i === TOTAL_STEPS - 1 ? "rounded-r" : ""} ${
              step >= i + 1 ? "bg-green-700" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-800 text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-800 text-sm font-medium">
          ✅ {successMessage}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            {[
              { label: "ARTISTIC NAME / STAGE NAME", name: "name_artistic", placeholder: "How do you want to be known?" },
              { label: "CITY / LOCATION", name: "city", placeholder: "Where are you based?" },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-green-900 mb-2">{label}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition"
                />
              </div>
            ))}
            <button type="button" onClick={handleNext} className="w-full bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition">
              Próximo
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-3">INSTRUMENTS</label>
              <div className="flex flex-wrap gap-2">
                {instruments.map((inst) => (
                  <TagButton
                    key={inst.id}
                    label={inst.name}
                    active={formData.instrument_ids.includes(inst.id)}
                    onClick={() => handleToggleId("instrument_ids", inst.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-3">MUSICAL GENRES</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <TagButton
                    key={genre.id}
                    label={genre.name}
                    active={formData.genre_ids.includes(genre.id)}
                    onClick={() => handleToggleId("genre_ids", genre.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">YEARS OF EXPERIENCE</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition"
              />
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={handleBack} className="text-green-900 underline">Voltar</button>
              <button type="button" onClick={handleNext} className="bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition">Próximo</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-3">PROFILE PHOTO</label>
              {!image ? (
                <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-green-700 transition overflow-hidden bg-white/50">
                  <input type="file" accept="image/*" onChange={onFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <span className="text-3xl mb-1">📸</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Choose Photo</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-56 bg-gray-200 rounded-md overflow-hidden border border-gray-400">
                    <Cropper image={image} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-1">Zoom</label>
                    <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-green-700" />
                  </div>
                  <div className="flex justify-center">
                    <button type="button" onClick={() => setImage(null)} className="text-sm text-green-900 underline">Escolher outra foto</button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="p-4 rounded-md border border-gray-300 bg-white/40">
              <p className="text-sm font-bold text-green-900 mb-2 uppercase">Resumo</p>
              <p className="text-sm text-green-900"><span className="font-semibold">Nome artístico: </span>{formData.name_artistic}</p>
              <p className="text-sm text-green-900"><span className="font-semibold">Cidade: </span>{formData.city}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded">{formData.instrument_ids.length} Instrumentos</span>
                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded">{formData.genre_ids.length} Gêneros</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={handleBack} className="text-green-900 underline">Voltar</button>
              <button type="submit" disabled={loading} className="bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition disabled:opacity-50">
                {loading ? "Salvando..." : "Cadastrar"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}