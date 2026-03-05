"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

export default function BandForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [genres, setGenres] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    bio: "",
    genre_description: "",
    genre_ids: [],
    profile_image: "",
  });

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await api.get("/genre");
        setGenres(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleGenre = (id) => {
    setFormData((prev) => {
      const exists = prev.genre_ids.includes(id);
      return {
        ...prev,
        genre_ids: exists
          ? prev.genre_ids.filter((g) => g !== id)
          : [...prev.genre_ids, id],
      };
    });
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
        "/band",
        { ...formData, profile_image: finalImageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("profileCompleted", true);
      router.push("/");
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
      setErrorMessage("Fill band name and city.");
      return;
    }

    if (step === 2 && formData.genre_ids.length === 0) {
      setErrorMessage("Select at least one genre.");
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    setStep((s) => s - 1);
  };

  const input =
    "w-full h-[52px] rounded-xl border border-black/10 bg-black/[0.03] px-4 text-[15px] outline-none focus:border-gray-400 transition";

  const textarea =
    "w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-[15px] outline-none focus:border-gray-400 resize-none";

  return (
    <div className="w-full max-w-md">

      {/* HEADER */}

      <div className="mb-8 text-center">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400 font-semibold">
          BandLink
        </p>

        <h1 className="text-[30px] font-semibold text-gray-900 mt-2">
          Band profile
        </h1>

        <p className="text-[13px] text-gray-400 mt-1">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* PROGRESS */}

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

      <form onSubmit={handleUploadAndFinish} className="flex flex-col gap-4">

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Band name"
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
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your band"
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
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleToggleGenre(genre.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    formData.genre_ids.includes(genre.id)
                      ? "bg-gray-900 text-white"
                      : "bg-black/[0.05] text-gray-700 hover:bg-black/[0.1]"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            <input
              name="genre_description"
              value={formData.genre_description}
              onChange={handleChange}
              placeholder="Describe your sound"
              className={input}
            />

            <div className="flex gap-3 mt-2">
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
                  Choose photo
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

            <div className="flex gap-3 mt-4">
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