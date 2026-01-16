import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
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

  const renderStep = () => {
    // Step 1: Welcome
    if (step === 1) {
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
