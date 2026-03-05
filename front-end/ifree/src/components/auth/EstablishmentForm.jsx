"use client";

import { useState, useCallback } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

export default function EstablishmentForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

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

  const input =
    "w-full h-[52px] rounded-xl border border-black/10 bg-black/[0.03] px-4 text-[15px] outline-none focus:border-gray-400 transition";

  const textarea =
    "w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-[15px] outline-none focus:border-gray-400 resize-none";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = (e) => {
    if (e.target.files?.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImage(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const createCroppedImage = async () => {
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

      setSuccessMessage("Perfil criado com sucesso! Redirecionando...");
      localStorage.setItem("profileCompleted", true);

      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Erro ao salvar perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setErrorMessage("");

    if (step === 1 && (!formData.name || !formData.city)) {
      setErrorMessage("Fill establishment name and city.");
      return;
    }

    if (step === 2 && !formData.contact_phone) {
      setErrorMessage("Enter contact phone.");
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setStep((s) => s - 1);
  };

  return (
    <div className="w-full max-w-md">

      {/* HEADER */}

      <div className="mb-8 text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400 font-semibold">
          BandLink
        </p>

        <h1 className="text-[30px] font-semibold text-gray-900 mt-2">
          Establishment profile
        </h1>

        <p className="text-[13px] text-gray-400 mt-1">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* PROGRESS BAR */}

      <div className="flex gap-1.5 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full ${
              step >= i ? "bg-gray-900" : "bg-black/10"
            }`}
          />
        ))}
      </div>

      {errorMessage && (
        <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-green-600 text-sm mb-4">{successMessage}</p>
      )}

      <form onSubmit={handleUploadAndFinish} className="flex flex-col gap-4">

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Establishment name"
              className={input}
            />

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City / location"
              className={input}
            />

            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your establishment"
              className={textarea}
            />

            <button
              type="button"
              onClick={handleNext}
              className="w-full h-[52px] rounded-xl bg-gray-900 text-white font-semibold hover:bg-black"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <input
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="Contact phone"
              className={input}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="h-[52px] px-6 rounded-xl border border-black/10 hover:bg-black/[0.03]"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex-1 h-[52px] rounded-xl bg-gray-900 text-white hover:bg-black"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}

        {step === 3 && (
          <>
            {!image ? (
              <label className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />

                <span className="text-3xl">📸</span>
                <span className="text-xs text-gray-400 mt-1">
                  Upload photo
                </span>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-200">
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

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />

                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="text-sm text-gray-500 underline"
                >
                  Choose another photo
                </button>
              </div>
            )}

            {/* SUMMARY */}

            <div className="p-4 rounded-xl border border-black/10 bg-black/[0.02] text-sm">
              <p className="font-semibold mb-2">Summary</p>
              <p>Name: {formData.name}</p>
              <p>City: {formData.city}</p>
              <p>Phone: {formData.contact_phone}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="h-[52px] px-6 rounded-xl border border-black/10"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[52px] rounded-xl bg-gray-900 text-white hover:bg-black disabled:opacity-50"
              >
                {loading ? "Saving..." : "Finish"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}