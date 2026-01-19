import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Chat from './components/Chat'

// Generar o recuperar sessionId único
const getSessionId = () => {
  let sessionId = localStorage.getItem('mindchat_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('mindchat_session_id', sessionId);
  }
  return sessionId;
};

// Guardar estado en localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Cargar estado desde localStorage
const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

function App() {
  const [currentView, setCurrentView] = useState('onboarding') // onboarding | chat
  const [userData, setUserData] = useState(null)
  const [generatedVoices, setGeneratedVoices] = useState(null)
  const [isGeneratingVoices, setIsGeneratingVoices] = useState(false)
  const [generationError, setGenerationError] = useState(null)
  const [sessionId, setSessionId] = useState(getSessionId())

  const [debugConfig, setDebugConfig] = useState(null) // null | { profileType, profileModel, chatModel }

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedUserData = loadFromLocalStorage('mindchat_user_data');
    const savedVoices = loadFromLocalStorage('mindchat_voices');
    const savedDebugConfig = loadFromLocalStorage('mindchat_debug_config');

    if (savedUserData && savedVoices) {
      console.log('[MindChat] Loading saved session:', {
        userData: savedUserData,
        voicesCount: savedVoices.length,
        debugConfig: savedDebugConfig
      });

      setUserData(savedUserData);
      setGeneratedVoices(savedVoices);
      setDebugConfig(savedDebugConfig);
      setCurrentView('chat');
    } else {
      console.log('[MindChat] No saved session found, starting onboarding');
    }
  }, []);

  const handleOnboardingComplete = async (data, config = null) => {
    setUserData(data)
    setDebugConfig(config)

    console.log('[MindChat] Onboarding complete:', { data, config });

    // Limpiar voces anteriores antes de guardar nuevos datos
    localStorage.removeItem('mindchat_voices');
    localStorage.removeItem('mindchat_messages');
    localStorage.removeItem('mindchat_messages_remaining');

    // Guardar userData y debugConfig
    saveToLocalStorage('mindchat_user_data', data);
    saveToLocalStorage('mindchat_debug_config', config);

    // Si es modo debug con perfil mock, usar voces pre-generadas
    if (config && config.profileType === 'mock') {
      console.log('[MindChat] Using mock profile voices');
      // Importar dinámicamente el perfil debug
      const { debugVoices } = await import('./debugProfile.js')
      setGeneratedVoices(debugVoices)
      saveToLocalStorage('mindchat_voices', debugVoices);
      setCurrentView('chat')
      return
    }

    // Si no es debug mock, generar voces con API
    // (incluye: normal flow, o debug con profileType === 'generate')
    console.log('[MindChat] Generating voices with API, model:', config?.profileModel || 'haiku');
    setIsGeneratingVoices(true)
    setGenerationError(null)

    try {
      // Determinar qué modelo usar para generar el perfil
      const modelToUse = config?.profileModel || 'haiku' // Default: haiku

      // Crear AbortController para timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos timeout

      try {
        var response = await fetch('/api/generate-voices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userData: data,
            model: modelToUse // Pasamos el modelo específico
          }),
          signal: controller.signal
        })
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('La generación de voces tomó demasiado tiempo. Por favor intenta de nuevo.')
        }
        throw fetchError
      } finally {
        clearTimeout(timeoutId)
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }

      const responseData = await response.json()
      console.log('[MindChat] Generated voices:', responseData);

      if (responseData.success && responseData.voces) {
        setGeneratedVoices(responseData.voces)
        saveToLocalStorage('mindchat_voices', responseData.voces);
        setCurrentView('chat')
      } else {
        throw new Error('Respuesta inválida del servidor')
      }
    } catch (err) {
      console.error('[MindChat] Error generating voices:', err)
      setGenerationError(err.message)
    } finally {
      setIsGeneratingVoices(false)
    }
  }

  const resetApp = () => {
    // Limpiar localStorage (excepto sessionId)
    localStorage.removeItem('mindchat_user_data');
    localStorage.removeItem('mindchat_voices');
    localStorage.removeItem('mindchat_debug_config');
    localStorage.removeItem('mindchat_messages');
    localStorage.removeItem('mindchat_messages_remaining');

    setCurrentView('onboarding')
    setUserData(null)
    setGeneratedVoices(null)
    setIsGeneratingVoices(false)
    setGenerationError(null)
    setDebugConfig(null)
  }

  return (
    <div className="app">
      {currentView === 'onboarding' && !isGeneratingVoices && !generationError && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {isGeneratingVoices && (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <svg className="animate-spin h-12 w-12 text-purple-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Generando tus voces internas...
            </div>
            <p className="text-gray-400 text-sm">
              {debugConfig?.profileModel === 'sonnet'
                ? 'Esto puede tomar 20-40 segundos con Sonnet'
                : 'Esto puede tomar 15-30 segundos'}
            </p>
            {debugConfig && (
              <p className="text-xs text-gray-500 mt-2">
                Modelo: {debugConfig.profileModel === 'sonnet' ? '🔵 Sonnet' : '🟢 Haiku'}
              </p>
            )}
          </div>
        </div>
      )}

      {generationError && (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
          <div className="max-w-md space-y-4">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6">
              <div className="font-bold text-red-400 mb-2 text-xl">Error</div>
              <div className="text-red-300 mb-4">{generationError}</div>
              <button
                onClick={resetApp}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'chat' && generatedVoices && (
        <Chat
          voices={generatedVoices}
          userData={userData}
          onReset={resetApp}
          debugConfig={debugConfig}
        />
      )}
    </div>
  )
}

export default App
