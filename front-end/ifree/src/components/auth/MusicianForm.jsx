"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";

const TOTAL_STEPS = 3;

function FloatingInput({ label, name, value, onChange, type = "text", min }) {
  const [focus, setFocus] = useState(false);
  const active = focus || value;

  return (
    <div className="relative">
      <input
        name={name}
        value={value}
        type={type}
        min={min}
        required
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={`w-full h-[52px] rounded-xl border outline-none pl-4 pr-4 text-[15px] bg-black/[0.03]
        ${focus ? "border-gray-400" : "border-black/10"}
        ${active ? "pt-5 pb-1" : ""}`}
      />

      <label
        className={`absolute left-4 transition-all
        ${active ? "top-1 text-[10px] uppercase font-semibold" : "top-1/2 -translate-y-1/2"}
        ${focus ? "text-gray-500" : "text-gray-400"}`}
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
      className={`px-3 py-1.5 rounded-lg text-[13px] border
      ${active
        ? "bg-gray-900 text-white border-gray-900"
        : "border-black/10 text-gray-500 hover:border-gray-400 bg-black/[0.02]"}`}
    >
      {label}
    </button>
  );
}

export default function MusicianForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [form, setForm] = useState({
    name_artistic: "",
    city: "",
    experience_years: 0,
    profile_image: "",
    genre_ids: [],
    instrument_ids: [],
    skills:[],
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");

    Promise.all([api.get("v1/genre"), api.get("v1/instrument")]).then(([g, i]) => {
      setGenres(g.data || []);
      setInstruments(i.data || []);
    });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "experience_years" ? Number(value) : value,
    });
  }

  function toggle(field, id) {
    const list = form[field];

    setForm({
      ...form,
      [field]: list.includes(id)
        ? list.filter((i) => i !== id)
        : [...list, id],
    });
  }

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function getCroppedBlob() {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = image;

    await new Promise((res) => (img.onload = res));

    const { x, y, width, height } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    return new Promise((res) => canvas.toBlob(res, "image/jpeg"));
  }

  function next() {
    setError("");

    if (step === 1 && (!form.name_artistic || !form.city)) {
      return setError("Fill in your artistic name and city.");
    }

    if (step === 2) {
      if(!form.skills.length){
        return setError("Select at least one skill")
      }
      if (!form.genre_ids.length || !form.instrument_ids.length) {
        return setError("Select at least one genre and instrument.");
      }
    }

    setStep(step + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      let profile_image = form.profile_image;

      if (image && croppedAreaPixels) {
        const blob = await getCroppedBlob();

        const fd = new FormData();
        fd.append("image", blob, "profile.jpg");

        const { data } = await api.post("v1/musician/upload", fd);
      

        profile_image = data.url;
      }

      await api.post("v1/musician", {
        ...form,
        profile_image,
      });
      localStorage.setItem("profileCompleted", "true");
      
      setSuccess("Profile saved!");
      setTimeout(() => router.push("/"), 1000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error saving profile"
      );
    }

    setLoading(false);
  }

  return (
    <div className="w-full">

      {/* HEADER */}

      <div className="text-center mb-8">
        <p className="text-[11px] tracking-[0.3em] uppercase text-gray-400">
          BandLink
        </p>

        <h1 className="text-[28px] font-semibold">
          Musician profile
        </h1>

        <p className="text-[13px] text-gray-400">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* PROGRESS */}

      <div className="flex gap-1.5 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] rounded-full ${
              step >= i + 1 ? "bg-gray-900" : "bg-black/10"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {step === 1 && (
          <>
            <FloatingInput
              label="Artistic name"
              name="name_artistic"
              value={form.name_artistic}
              onChange={handleChange}
            />

            <FloatingInput
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={next}
              className="h-[52px] rounded-xl bg-gray-900 text-white font-semibold"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
           <div>
              <p className="text-[10px] uppercase text-gray-400 mb-2">
                I am a...
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "instrumentalist", label: "🎸 Instrumentalist" },
                  { value: "vocalist", label: "🎤 Vocalist" },
                  { value: "dj", label: "🎧 DJ" },
                ].map((s) => (
                  <TagButton
                    key={s.value}
                    label={s.label}
                    active={form.skills.includes(s.value)}
                    onClick={() => toggle("skills", s.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase text-gray-400 mb-2">
                Instruments
              </p>

              <div className="flex flex-wrap gap-2">
                {instruments.map((i) => (
                  <TagButton
                    key={i.id}
                    label={i.name}
                    active={form.instrument_ids.includes(i.id)}
                    onClick={() => toggle("instrument_ids", i.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase text-gray-400 mb-2">
                Genres
              </p>

              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <TagButton
                    key={g.id}
                    label={g.name}
                    active={form.genre_ids.includes(g.id)}
                    onClick={() => toggle("genre_ids", g.id)}
                  />
                ))}
              </div>
            </div>

            <FloatingInput
              label="Years of experience"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              type="number"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 border rounded-xl"
              >
                Back
              </button>

              <button
                type="button"
                onClick={next}
                className="flex-1 h-[52px] rounded-xl bg-gray-900 text-white"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {!image ? (
              <div className="relative w-36 h-36 mx-auto border-2 border-dashed rounded-full flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="absolute inset-0 opacity-0"
                />

                
              </div>
            ) : (
              <div className="h-52 relative border rounded-xl overflow-hidden">
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] rounded-xl bg-gray-900 text-white"
            >
              {loading ? "Saving..." : "Save profile"}
            </button>
          </>
        )}

      </form>
    </div>
  );
}