"use client";

import { useState, useCallback } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

export default function EstablishmentForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    description: "",
    contact_phone: "",
    profile_image: "",
  });

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadAndFinish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const token = localStorage.getItem("token");

    try {
      let finalImageUrl = formData.profile_image;

      if (image && croppedAreaPixels) {
        const croppedBlob = await createCroppedImage();
        const uploadData = new FormData();
        uploadData.append("image", croppedBlob, "profile.jpg");

        const uploadRes = await api.post("/media/upload", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        finalImageUrl = uploadRes.data.url;
      }

      await api.post(
        "/establishment",
        { ...formData, profile_image: finalImageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Perfil cadastrado com sucesso! Redirecionando...");
      localStorage.setItem("profileCompleted", true);
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
    if (step === 1 && (!formData.name || !formData.city)) {
      setErrorMessage("Preencha o nome e a cidade");
      return;
    }
    if (step === 2 && !formData.contact_phone) {
      setErrorMessage("Preencha o telefone de contato");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setStep(step - 1);
  };

  const totalSteps = 3;

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-green-900 mb-6">
        ESTABLISHMENT PROFILE
      </h2>

      {/* Barra de Progresso */}
      <div className="flex mb-8 gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 ${i === 0 ? "rounded-l" : i === totalSteps - 1 ? "rounded-r" : ""} ${
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

      <form className="space-y-6" onSubmit={handleUploadAndFinish}>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                ESTABLISHMENT NAME
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="What is your establishment's name?"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                CITY / LOCATION
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Where are you located?"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your establishment..."
                rows={3}
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition"
            >
              Próximo
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                CONTACT PHONE
              </label>
              <input
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full border rounded-md border-gray-400 bg-transparent px-4 py-3 focus:outline-none focus:border-green-800 transition"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-green-900 underline"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition"
              >
                Próximo
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Foto */}
        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-3">
                PROFILE PHOTO
              </label>

              {!image ? (
                <div className="relative w-40 h-40 mx-auto rounded-full border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-green-700 transition overflow-hidden bg-white/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <span className="text-3xl mb-1">📸</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Choose Photo
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative w-full h-56 bg-gray-200 rounded-md overflow-hidden border border-gray-400">
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-900 mb-1">
                      Zoom
                    </label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-label="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-green-700"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-sm text-green-900 underline"
                    >
                      Escolher outra foto
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="p-4 rounded-md border border-gray-300 bg-white/40">
              <p className="text-sm font-bold text-green-900 mb-2 uppercase">
                Resumo
              </p>
              <p className="text-sm text-green-900">
                <span className="font-semibold">Nome: </span>
                {formData.name}
              </p>
              <p className="text-sm text-green-900">
                <span className="font-semibold">Cidade: </span>
                {formData.city}
              </p>
              <p className="text-sm text-green-900">
                <span className="font-semibold">Telefone: </span>
                {formData.contact_phone}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-green-900 underline"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 text-white rounded-md px-12 py-3 hover:bg-green-800 transition disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Cadastrar"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}