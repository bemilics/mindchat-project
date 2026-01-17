import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [debugStep, setDebugStep] = useState(1); // Para el wizard del debug
  const [debugProfileType, setDebugProfileType] = useState(null); // 'mock' | 'generate'
  const [userData, setUserData] = useState({
    // Manual inputs
    mbti: '',
    signo: '',
    generacion: '',
    
    // MBTI test answers (if needed)
    mbtiAnswers: [],
    
    // Demographics
    fechaNacimiento: '',
    anioNacimiento: '',
    
    // Cultural preferences
    musica: [],
    peliculas: ['', '', ''],
    videojuegos: ['', '', ''],
    alignment: '',
    nivelOnline: 3
  });

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const signos = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer',
    'Leo', 'Virgo', 'Libra', 'Escorpio',
    'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];

  const generaciones = [
    'Gen Alpha (2013+)',
    'Gen Z (1997-2012)',
    'Millennial (1981-1996)',
    'Gen X (1965-1980)',
    'Boomer (1946-1964)'
  ];

  const generosMusicales = [
    'Indie/Alternative',
    'Hip Hop/Rap',
    'Rock/Metal',
    'Pop',
    'Electronic/EDM',
    'R&B/Soul',
    'Jazz/Blues',
    'Reggaeton/Latin',
    'Country/Folk',
    'Classical/Instrumental',
    'K-Pop/J-Pop',
    'Punk/Emo'
  ];

  const mbtiQuestions = [
    {
      q: "En una fiesta, prefieres:",
      options: [
        { text: "Hablar con muchas personas diferentes", dimension: 'E' },
        { text: "Conversaciones profundas con pocas personas", dimension: 'I' }
      ]
    },
    {
      q: "Cuando tomas decisiones:",
      options: [
        { text: "Te guías por la lógica y el análisis", dimension: 'T' },
        { text: "Consideras cómo afectará a los demás", dimension: 'F' }
      ]
    },
    {
      q: "Prefieres:",
      options: [
        { text: "Tener planes claros y definidos", dimension: 'J' },
        { text: "Ser espontáneo y adaptarte sobre la marcha", dimension: 'P' }
      ]
    },
    {
      q: "Te concentras más en:",
      options: [
        { text: "El panorama general y las posibilidades", dimension: 'N' },
        { text: "Los detalles y la realidad actual", dimension: 'S' }
      ]
    },
    {
      q: "En el trabajo o estudio:",
      options: [
        { text: "Prefieres colaborar y compartir ideas", dimension: 'E' },
        { text: "Prefieres trabajar solo y en silencio", dimension: 'I' }
      ]
    },
    {
      q: "Cuando hay un conflicto:",
      options: [
        { text: "Buscas la solución más justa objetivamente", dimension: 'T' },
        { text: "Buscas armonía y entender las emociones", dimension: 'F' }
      ]
    },
    {
      q: "Tu espacio de trabajo es:",
      options: [
        { text: "Ordenado y organizado", dimension: 'J' },
        { text: "Flexible y algo caótico", dimension: 'P' }
      ]
    },
    {
      q: "Te interesa más:",
      options: [
        { text: "Teorías abstractas y conceptos nuevos", dimension: 'N' },
        { text: "Experiencias prácticas y comprobadas", dimension: 'S' }
      ]
    },
    {
      q: "Recargas energía:",
      options: [
        { text: "Estando con amigos y socializing", dimension: 'E' },
        { text: "Estando solo en tu espacio", dimension: 'I' }
      ]
    },
    {
      q: "Al resolver problemas:",
      options: [
        { text: "Analizas pros y contras racionalmente", dimension: 'T' },
        { text: "Confías en tu intuición y valores", dimension: 'F' }
      ]
    }
  ];

  const alignmentOptions = [
    ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
    ['Lawful Neutral', 'True Neutral', 'Chaotic Neutral'],
    ['Lawful Evil', 'Neutral Evil', 'Chaotic Evil']
  ];

  const nivelOnlineLabels = [
    { emoji: '📵', text: 'Offline warrior', desc: 'Celular solo por necesidad' },
    { emoji: '🤳', text: 'Casual scroller', desc: 'Uso normal, me desconecto fácil' },
    { emoji: '📱', text: 'Active user', desc: 'Estoy bastante conectado' },
    { emoji: '💻', text: 'Chronically online', desc: 'Vivo en internet' },
    { emoji: '🧠', text: 'Terminally online', desc: 'Soy parte de la cultura de internet' }
  ];

  const needsMBTITest = !userData.mbti || userData.mbti === 'no-se';
  const needsSigno = !userData.signo || userData.signo === 'no-se';
  const needsGeneracion = !userData.generacion || userData.generacion === 'no-se';

  const handleMusicToggle = (genre) => {
    if (userData.musica.includes(genre)) {
      setUserData({
        ...userData,
        musica: userData.musica.filter(g => g !== genre)
      });
    } else if (userData.musica.length < 3) {
      setUserData({
        ...userData,
        musica: [...userData.musica, genre]
      });
    }
  };

  const handleMBTIAnswer = (dimension) => {
    const newAnswers = [...userData.mbtiAnswers, dimension];
    setUserData({ ...userData, mbtiAnswers: newAnswers });

    if (newAnswers.length === 10) {
      // Calculate MBTI from answers
      const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      newAnswers.forEach(d => counts[d]++);

      const mbti =
        (counts.E > counts.I ? 'E' : 'I') +
        (counts.S > counts.N ? 'S' : 'N') +
        (counts.T > counts.F ? 'T' : 'F') +
        (counts.J > counts.P ? 'J' : 'P');

      setUserData({ ...userData, mbti, mbtiAnswers: newAnswers });

      // Go to the correct step after completing MBTI test
      // Check if we need fecha/año (using current userData values)
      const stillNeedsSigno = !userData.signo || userData.signo === 'no-se';
      const stillNeedsGeneracion = !userData.generacion || userData.generacion === 'no-se';

      if (stillNeedsSigno || stillNeedsGeneracion) {
        setStep(4); // Go to fecha/generacion step
      } else {
        setStep(5); // Skip to music preferences
      }
    }
  };

  const canContinue = () => {
    switch(step) {
      case 2: // Manual inputs
        return true; // All optional
      case 3: // MBTI Test
        return !needsMBTITest;
      case 4: // Fecha/Generacion
        if (needsSigno && !userData.fechaNacimiento) return false;
        if (needsGeneracion && !userData.anioNacimiento) return false;
        return true;
      case 5: // Música
        return userData.musica.length === 3;
      case 6: // Películas
        return userData.peliculas.filter(p => p.trim()).length === 3;
      case 7: // Videojuegos
        return true; // Optional
      case 8: // Alignment
        return !!userData.alignment;
      case 9: // Nivel Online
        return true;
      default:
        return true;
    }
  };

  const handleDebugMode = async (profileType, profileModel, chatModel) => {
    // profileType: 'mock' | 'generate'
    // profileModel: null | 'haiku' | 'sonnet' (null si profileType es 'mock')
    // chatModel: 'mock' | 'haiku' | 'sonnet'

    const debugConfig = {
      profileType,
      profileModel,
      chatModel
    };

    if (profileType === 'mock') {
      // Cargar perfil preset
      const { debugUserData } = await import('../debugProfile.js');
      onComplete(debugUserData, debugConfig);
    } else {
      // profileType === 'generate', necesitamos generar el perfil con API
      const { debugUserData } = await import('../debugProfile.js');
      // Pasamos userData base para que genere con API
      onComplete(debugUserData, debugConfig);
    }

    setShowDebugMenu(false);
    setDebugStep(1);
    setDebugProfileType(null);
  };

  const renderStep = () => {
    // Step 1: Welcome
    if (step === 1) {
      // Debug mode disponible en:
      // 1. localhost
      // 2. Vercel preview/develop (con variable de entorno)
      // 3. NUNCA en producción
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isDebugEnabled = import.meta.env.VITE_ENABLE_DEBUG === 'true';
      const isDev = isLocalhost || isDebugEnabled;

      return (
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              MINDCHAT
            </h1>
            <p className="text-gray-400 text-lg">
              Tu group chat interno
            </p>
          </div>

          <div className="space-y-4 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              Vamos a crear las voces en tu cabeza, pero personalizadas para ti.
            </p>
            <p className="text-gray-400 text-sm">
              Esto toma ~3 minutos. Las voces van a hablar como TÚ hablarías contigo mismo.
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition"
          >
            Empezar
          </button>

          {isDev && (
            <>
              <button
                onClick={() => setShowDebugMenu(true)}
                className="w-full max-w-xs mx-auto bg-gray-800 hover:bg-gray-700 text-gray-400 py-2 px-4 rounded-lg text-sm font-medium transition border border-gray-700"
              >
                🐛 Debug Mode (Skip to Chat)
              </button>

              {/* Debug Menu Modal */}
              {showDebugMenu && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">
                          🐛 Modo Debug {debugStep === 2 && `- Paso 2 de 2`}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {debugStep === 1
                            ? "Paso 1: Selecciona el tipo de perfil"
                            : "Paso 2: Selecciona los modelos a usar"}
                        </p>
                      </div>

                      {/* Step 1: Tipo de Perfil */}
                      {debugStep === 1 && (
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setDebugProfileType('mock');
                              setDebugStep(2);
                            }}
                            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white p-4 rounded-lg text-left transition"
                          >
                            <div className="font-bold mb-1">
                              🎭 Mock Profile (Preset)
                            </div>
                            <div className="text-sm text-white/80">
                              Usar perfil pre-generado (ISTJ, Capricornio, Gen Z, etc.)
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              ✅ No consume créditos para el perfil • Voces ya creadas
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              setDebugProfileType('generate');
                              setDebugStep(2);
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-lg text-left transition"
                          >
                            <div className="font-bold mb-1">
                              🤖 Generate Profile (API)
                            </div>
                            <div className="text-sm text-white/80">
                              Generar voces con Claude API usando perfil preset
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              ⚠️ Consume créditos para generar voces
                            </div>
                          </button>
                        </div>
                      )}

                      {/* Step 2: Modelos - Si Mock Profile */}
                      {debugStep === 2 && debugProfileType === 'mock' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-400 mb-2">
                            Perfil: <span className="text-yellow-400 font-bold">🎭 Mock</span> • Selecciona modelo para el chat:
                          </p>

                          <button
                            onClick={() => handleDebugMode('mock', null, 'mock')}
                            className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white p-4 rounded-lg text-left transition"
                          >
                            <div className="font-bold mb-1">
                              💾 Mock Chat
                            </div>
                            <div className="text-sm text-white/80">
                              Respuestas mock hardcodeadas
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              ✅ 0 créditos • Instantáneo
                            </div>
                          </button>

                          <button
                            onClick={() => handleDebugMode('mock', null, 'haiku')}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white p-4 rounded-lg text-left transition"
                          >
                            <div className="font-bold mb-1">
                              🟢 Haiku Chat
                            </div>
                            <div className="text-sm text-white/80">
                              Claude 3.5 Haiku para respuestas
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              💰 ~$0.001/mensaje • Rápido y económico
                            </div>
                          </button>

                          <button
                            onClick={() => handleDebugMode('mock', null, 'sonnet')}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-lg text-left transition"
                          >
                            <div className="font-bold mb-1">
                              🔵 Sonnet Chat
                            </div>
                            <div className="text-sm text-white/80">
                              Claude Sonnet 4 para respuestas premium
                            </div>
                            <div className="text-xs text-white/60 mt-1">
                              💎 ~$0.02/mensaje • Máxima calidad
                            </div>
                          </button>
                        </div>
                      )}

                      {/* Step 2: Modelos - Si Generate Profile */}
                      {debugStep === 2 && debugProfileType === 'generate' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-400 mb-2">
                            Perfil: <span className="text-purple-400 font-bold">🤖 Generate</span> • Selecciona modelos para perfil y chat:
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            {/* Haiku + Haiku */}
                            <button
                              onClick={() => handleDebugMode('generate', 'haiku', 'haiku')}
                              className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-4 rounded-lg text-left transition"
                            >
                              <div className="font-bold text-sm mb-1">
                                🟢 Haiku + 🟢 Haiku
                              </div>
                              <div className="text-xs text-white/80">
                                Perfil: Haiku
                              </div>
                              <div className="text-xs text-white/80">
                                Chat: Haiku
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                💰 ~$0.005 total
                              </div>
                            </button>

                            {/* Haiku + Sonnet */}
                            <button
                              onClick={() => handleDebugMode('generate', 'haiku', 'sonnet')}
                              className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 hover:from-green-500 hover:via-teal-500 hover:to-blue-500 text-white p-4 rounded-lg text-left transition"
                            >
                              <div className="font-bold text-sm mb-1">
                                🟢 Haiku + 🔵 Sonnet
                              </div>
                              <div className="text-xs text-white/80">
                                Perfil: Haiku
                              </div>
                              <div className="text-xs text-white/80">
                                Chat: Sonnet
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                💰 ~$0.024 total
                              </div>
                            </button>

                            {/* Sonnet + Haiku */}
                            <button
                              onClick={() => handleDebugMode('generate', 'sonnet', 'haiku')}
                              className="bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 hover:from-blue-500 hover:via-teal-500 hover:to-green-500 text-white p-4 rounded-lg text-left transition"
                            >
                              <div className="font-bold text-sm mb-1">
                                🔵 Sonnet + 🟢 Haiku
                              </div>
                              <div className="text-xs text-white/80">
                                Perfil: Sonnet
                              </div>
                              <div className="text-xs text-white/80">
                                Chat: Haiku
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                💰 ~$0.061 total
                              </div>
                            </button>

                            {/* Sonnet + Sonnet */}
                            <button
                              onClick={() => handleDebugMode('generate', 'sonnet', 'sonnet')}
                              className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white p-4 rounded-lg text-left transition"
                            >
                              <div className="font-bold text-sm mb-1">
                                🔵 Sonnet + 🔵 Sonnet
                              </div>
                              <div className="text-xs text-white/80">
                                Perfil: Sonnet
                              </div>
                              <div className="text-xs text-white/80">
                                Chat: Sonnet
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                💎 ~$0.08 total
                              </div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Botones de navegación */}
                      <div className="flex gap-2">
                        {debugStep === 2 && (
                          <button
                            onClick={() => {
                              setDebugStep(1);
                              setDebugProfileType(null);
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition"
                          >
                            ← Atrás
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowDebugMenu(false);
                            setDebugStep(1);
                            setDebugProfileType(null);
                          }}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm transition"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <p className="text-xs text-gray-500 mt-8">
            Disclaimer: Esto es para entretenimiento. Si estás en crisis, habla con un profesional.
          </p>
        </div>
      );
    }

    // Step 2: Manual Inputs
    if (step === 2) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">¿Te conoces?</h2>
            <p className="text-gray-400">Si ya sabes estos datos, nos ahorras tiempo (todos opcionales)</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Tu MBTI</label>
              <select
                value={userData.mbti}
                onChange={(e) => setUserData({ ...userData, mbti: e.target.value })}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="">No sé mi MBTI</option>
                <option value="no-se">Prefiero hacer el test</option>
                {mbtiTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Tu signo zodiacal</label>
              <select
                value={userData.signo}
                onChange={(e) => setUserData({ ...userData, signo: e.target.value })}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="">No sé mi signo</option>
                <option value="no-se">Prefiero poner mi fecha de nacimiento</option>
                {signos.map(signo => (
                  <option key={signo} value={signo}>{signo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Tu generación</label>
              <select
                value={userData.generacion}
                onChange={(e) => setUserData({ ...userData, generacion: e.target.value })}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="">No sé mi generación</option>
                <option value="no-se">Prefiero poner mi año de nacimiento</option>
                {generaciones.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              if (needsMBTITest) {
                setStep(3);
              } else if (needsSigno || needsGeneracion) {
                setStep(4);
              } else {
                setStep(5);
              }
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 3: MBTI Test
    if (step === 3 && needsMBTITest) {
      const currentQ = userData.mbtiAnswers.length;

      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Test de personalidad</h2>
              <span className="text-sm text-gray-400">{currentQ + 1}/10</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{ width: `${((currentQ + 1) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 text-lg">{mbtiQuestions[currentQ].q}</p>
            <div className="space-y-3">
              {mbtiQuestions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMBTIAnswer(option.dimension)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-lg text-left transition border border-gray-700 hover:border-purple-500"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Step 4: Fecha Nacimiento / Generación
    if (step === 4 && (needsSigno || needsGeneracion)) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Últimos datos básicos</h2>
            <p className="text-gray-400">Para afinar tu perfil</p>
          </div>

          <div className="space-y-4">
            {needsSigno && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={userData.fechaNacimiento}
                  onChange={(e) => setUserData({ ...userData, fechaNacimiento: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Para calcular tu signo zodiacal</p>
              </div>
            )}

            {needsGeneracion && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Año de nacimiento</label>
                <input
                  type="number"
                  min="1920"
                  max="2025"
                  placeholder="Ej: 1998"
                  value={userData.anioNacimiento}
                  onChange={(e) => setUserData({ ...userData, anioNacimiento: e.target.value })}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(5)}
            disabled={!canContinue()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 5: Música
    if (step === 5) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tu soundtrack</h2>
            <p className="text-gray-400">Selecciona 3 géneros que escuchas más ({userData.musica.length}/3)</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {generosMusicales.map(genre => {
              const isSelected = userData.musica.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => handleMusicToggle(genre)}
                  disabled={!isSelected && userData.musica.length >= 3}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(6)}
            disabled={!canContinue()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 6: Películas
    if (step === 6) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Cinema favorites</h2>
            <p className="text-gray-400">Tus 3 películas favoritas (las que ves una y otra vez)</p>
          </div>

          <div className="space-y-3">
            {userData.peliculas.map((pelicula, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Película ${idx + 1}`}
                value={pelicula}
                onChange={(e) => {
                  const newPeliculas = [...userData.peliculas];
                  newPeliculas[idx] = e.target.value;
                  setUserData({ ...userData, peliculas: newPeliculas });
                }}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 placeholder-gray-500"
              />
            ))}
          </div>

          <button
            onClick={() => setStep(7)}
            disabled={!canContinue()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 7: Videojuegos
    if (step === 7) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Gaming setup</h2>
            <p className="text-gray-400">Tus 3 juegos favoritos (o deja en blanco si no juegas)</p>
          </div>

          <div className="space-y-3">
            {userData.videojuegos.map((juego, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Videojuego ${idx + 1} (opcional)`}
                value={juego}
                onChange={(e) => {
                  const newJuegos = [...userData.videojuegos];
                  newJuegos[idx] = e.target.value;
                  setUserData({ ...userData, videojuegos: newJuegos });
                }}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 placeholder-gray-500"
              />
            ))}
          </div>

          <button
            onClick={() => setStep(8)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 8: Alignment Chart
    if (step === 8) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tu moral compass</h2>
            <p className="text-gray-400">¿Dónde te ubicas en el alignment chart?</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {alignmentOptions.flat().map(alignment => (
              <button
                key={alignment}
                onClick={() => setUserData({ ...userData, alignment })}
                className={`py-6 px-3 rounded-lg font-medium text-sm transition ${
                  userData.alignment === alignment
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {alignment}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(9)}
            disabled={!canContinue()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      );
    }

    // Step 9: Nivel Online
    if (step === 9) {
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Tu presencia digital</h2>
            <p className="text-gray-400">¿Qué tan online estás?</p>
          </div>

          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="4"
              value={userData.nivelOnline}
              onChange={(e) => setUserData({ ...userData, nivelOnline: parseInt(e.target.value) })}
              className="w-full accent-purple-500"
            />
            
            <div className="bg-gray-800 p-6 rounded-lg text-center space-y-2">
              <div className="text-4xl">{nivelOnlineLabels[userData.nivelOnline].emoji}</div>
              <div className="font-bold text-white">{nivelOnlineLabels[userData.nivelOnline].text}</div>
              <div className="text-sm text-gray-400">{nivelOnlineLabels[userData.nivelOnline].desc}</div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>Menos online</span>
              <span>Más online</span>
            </div>
          </div>

          <button
            onClick={() => {
              console.log('User data:', userData);
              onComplete(userData);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition"
          >
            Crear mis voces
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
