import React, { useState } from 'react';

const VoiceGenerator = ({ userData, onVoicesGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVoices, setGeneratedVoices] = useState(null);
  const [error, setError] = useState(null);

  const nivelOnlineText = [
    'Offline warrior',
    'Casual scroller', 
    'Active user',
    'Chronically online',
    'Terminally online'
  ][userData.nivelOnline - 1];

  const arquetipos = [
    {
      id: 'logica',
      nombre: 'LÓGICA',
      descripcion: 'Análisis racional, causa-efecto, problem solving. Detective analítico.'
    },
    {
      id: 'retorica',
      nombre: 'RETÓRICA',
      descripcion: 'Cómo comunicar, performance social, qué decir y cómo. Social strategist.'
    },
    {
      id: 'electrochemistry',
      nombre: 'ELECTROCHEMISTRY',
      descripcion: 'Impulsos, cravings, "hazlo ya", dopamina, placer/dolor. Hedonist demon.'
    },
    {
      id: 'fisico',
      nombre: 'FÍSICO',
      descripcion: 'Hambre, cansancio, dolor, necesidades básicas del cuerpo. Body status monitor.'
    },
    {
      id: 'intuicion',
      nombre: 'INTUICIÓN',
      descripcion: 'Gut feelings, vibes, creatividad, conexiones raras. Mystical weirdo.'
    },
    {
      id: 'volicion',
      nombre: 'VOLICIÓN',
      descripcion: 'Willpower, autodisciplina, resistencia, "tú puedes". Inner coach.'
    },
    {
      id: 'empatia',
      nombre: 'EMPATÍA',
      descripcion: 'Leer emociones propias y ajenas, sensibilidad social. Emotional intelligence.'
    },
    {
      id: 'ansiedad',
      nombre: 'ANSIEDAD',
      descripcion: 'Overthinking, worst-case scenarios, preocupaciones. Catastrophic thinker.'
    }
  ];

  const generateVoices = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Llamar al serverless function en lugar de Claude API directamente
      const response = await fetch('/api/generate-voices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userData: userData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.voces) {
        setGeneratedVoices(data.voces);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (err) {
      setError(err.message);
      console.error('Error generating voices:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Generador de Voces - Claude API
          </h1>
          <p className="text-gray-400">
            Prueba con usuario mockup
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-purple-400 mb-4">Perfil del Usuario Mockup</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Personalidad</div>
              <div className="text-white">
                <span className="font-bold">{userData.mbti}</span> • {userData.signo} • {userData.generacion}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Nivel Online</div>
              <div className="text-white">
                🧠 <span className="font-bold">{nivelOnlineText}</span> ({userData.nivelOnline}/5)
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Música</div>
              <div className="text-white">{userData.musica.join(' • ')}</div>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-1">Alignment</div>
              <div className="text-white font-bold">{userData.alignment}</div>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-gray-400 mb-1">Películas</div>
              <div className="text-white">{userData.peliculas.join(' • ')}</div>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-gray-400 mb-1">Videojuegos</div>
              <div className="text-white">{userData.videojuegos.join(' • ')}</div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={generateVoices}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Generando voces...
              </span>
            ) : (
              'Generar Voces con Claude API'
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
            <div className="font-bold text-red-400 mb-2">Error:</div>
            <div className="text-red-300">{error}</div>
          </div>
        )}

        {/* Generated Voices Display */}
        {generatedVoices && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              ✨ Voces Generadas ✨
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedVoices.map((voz, index) => {
                const arquetipo = arquetipos.find(a => a.nombre === voz.arquetipo);
                const colors = [
                  'border-blue-500',
                  'border-violet-500',
                  'border-pink-500',
                  'border-emerald-500',
                  'border-amber-500',
                  'border-red-500',
                  'border-cyan-500',
                  'border-indigo-500'
                ];

                return (
                  <div
                    key={index}
                    className={`bg-gray-800 rounded-lg p-5 border-2 ${colors[index]} hover:shadow-lg transition`}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          {voz.arquetipo}
                        </div>
                        <div className="text-2xl font-bold text-white mt-1">
                          {voz.nombre_personaje}
                        </div>
                      </div>

                      {/* Forma de hablar */}
                      <div>
                        <div className="text-sm font-semibold text-gray-400 mb-1">
                          Forma de hablar:
                        </div>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>
                            <span className="text-gray-500">Vocabulario:</span>{' '}
                            {voz.forma_de_hablar.vocabulario.join(', ')}
                          </div>
                          <div>
                            <span className="text-gray-500">Referencias:</span>{' '}
                            {voz.forma_de_hablar.referencias}
                          </div>
                          <div>
                            <span className="text-gray-500">Formalidad:</span>{' '}
                            {voz.forma_de_hablar.formalidad}
                          </div>
                          {voz.forma_de_hablar.slang && (
                            <div>
                              <span className="text-gray-500">Slang:</span>{' '}
                              {voz.forma_de_hablar.slang}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Catchphrases */}
                      <div>
                        <div className="text-sm font-semibold text-gray-400 mb-1">
                          Catchphrases:
                        </div>
                        <div className="space-y-1">
                          {voz.catchphrases.map((phrase, i) => (
                            <div
                              key={i}
                              className="text-sm text-purple-300 italic"
                            >
                              "{phrase}"
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ejemplo */}
                      <div>
                        <div className="text-sm font-semibold text-gray-400 mb-1">
                          Ejemplo:
                        </div>
                        <div className="bg-gray-900 rounded p-3 text-sm text-gray-200">
                          {voz.ejemplo_mensaje}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify({ voces: generatedVoices }, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'voces-generadas.json';
                  link.click();
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                📥 Exportar JSON
              </button>
              
              <button
                onClick={() => onVoicesGenerated(generatedVoices)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition"
              >
                Empezar a chatear →
              </button>
            </div>
          </div>
        )}

        {/* Arquetipos Reference */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-3">
            Los 8 Arquetipos Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {arquetipos.map((arq, i) => (
              <div key={i} className="text-sm">
                <span className="font-semibold text-white">{arq.nombre}:</span>{' '}
                <span className="text-gray-400">{arq.descripcion}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoiceGenerator;
