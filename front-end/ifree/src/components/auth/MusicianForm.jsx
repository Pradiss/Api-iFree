"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";

export default function MusicianForm() {
  const [step, setStep] = useState(1);

  const [nameArtistic, setNameArtistic] = useState("");
  const [city, setCity] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);

  const [loading, setLoading] = useState(false);

  // Buscar gêneros e instrumentos
  useEffect(() => {
    async function fetchData() {
      try {
        const genresRes = await api.get("/genre");
        const instrumentsRes = await api.get("/instrument");

        setGenres(genresRes.data);
        setInstruments(instrumentsRes.data);
      } catch (error) {
        console.log("Erro ao buscar dados");
      }
    }

    fetchData();
  }, []);

  const toggleSelection = (id, list, setList) => {
    if (list.includes(id)) {
      setList(list.filter((item) => item !== id));
    } else {
      setList([...list, id]);
    }
  };

  const handleSubmit = async () => {
    if (!nameArtistic || !city || !experienceYears) {
      alert("Preencha todos os campos");
      return;
    }

    if (selectedGenres.length === 0 || selectedInstruments.length === 0) {
      alert("Selecione pelo menos um gênero e um instrumento");
      return;
    }

    setLoading(true);

    const payload = {
      name_artistic: nameArtistic,
      city,
      experience_years: Number(experienceYears),
      genre_ids: selectedGenres,
      instrument_ids: selectedInstruments,
    };

    try {
      await api.post("/musician", payload);
      alert("Perfil criado com sucesso!");
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-green-900 mb-8">
        Complete seu perfil
      </h2>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              step >= item ? "bg-green-800" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="space-y-8">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Nome Artístico
              </label>
              <input
                type="text"
                value={nameArtistic}
                onChange={(e) => setNameArtistic(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-800"
              />
            </div>

            <button
              onClick={() => {
                if (!nameArtistic || !city) {
                  alert("Preencha todos os campos");
                  return;
                }
                setStep(2);
              }}
              className="w-full bg-green-800 text-white rounded-lg py-3 hover:bg-green-900"
            >
              Próximo
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Anos de Experiência
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-800"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-green-900 underline"
              >
                Voltar
              </button>

              <button
                onClick={() => {
                  if (!experienceYears) {
                    alert("Informe sua experiência");
                    return;
                  }
                  setStep(3);
                }}
                className="bg-green-800 text-white rounded-lg px-6 py-3 hover:bg-green-900"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <p className="font-semibold text-green-900 mb-3">
                Selecione seus gêneros
              </p>

              <div className="flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() =>
                      toggleSelection(
                        genre.id,
                        selectedGenres,
                        setSelectedGenres
                      )
                    }
                    className={`px-4 py-2 rounded-full border ${
                      selectedGenres.includes(genre.id)
                        ? "bg-green-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-green-900 mb-3">
                Selecione seus instrumentos
              </p>

              <div className="flex flex-wrap gap-3">
                {instruments.map((instrument) => (
                  <button
                    key={instrument.id}
                    type="button"
                    onClick={() =>
                      toggleSelection(
                        instrument.id,
                        selectedInstruments,
                        setSelectedInstruments
                      )
                    }
                    className={`px-4 py-2 rounded-full border ${
                      selectedInstruments.includes(instrument.id)
                        ? "bg-green-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    {instrument.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-green-900 underline"
              >
                Voltar
              </button>

              <button
                onClick={() => {
                  if (
                    selectedGenres.length === 0 ||
                    selectedInstruments.length === 0
                  ) {
                    alert("Selecione pelo menos um gênero e instrumento");
                    return;
                  }
                  setStep(4);
                }}
                className="bg-green-800 text-white rounded-lg px-6 py-3 hover:bg-green-900"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 - CONFIRMAÇÃO */}
        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-900">
              Confirme seus dados
            </h3>

            <div className=" p-6 rounded-lg space-y-3">
              <p><strong>Nome:</strong> {nameArtistic}</p>
              <p><strong>Cidade:</strong> {city}</p>
              <p><strong>Experiência:</strong> {experienceYears} anos</p>
              <p>
                <strong>Gêneros:</strong>{" "}
                {genres
                  .filter((g) => selectedGenres.includes(g.id))
                  .map((g) => g.name)
                  .join(", ")}
              </p>
              <p>
                <strong>Instrumentos:</strong>{" "}
                {instruments
                  .filter((i) => selectedInstruments.includes(i.id))
                  .map((i) => i.name)
                  .join(", ")}
              </p>
            </div>

            
            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="text-green-900 underline"
              >
                Voltar
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-800 text-white rounded-lg px-6 py-3 hover:bg-green-900 disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Confirmar e Criar Perfil"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}