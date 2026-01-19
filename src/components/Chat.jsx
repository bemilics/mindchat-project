import React, { useState, useRef, useEffect } from 'react';

const Chat = ({ voices: generatedVoices, userData, onReset, debugConfig = null }) => {
  // Cargar mensajes guardados o usar mensaje inicial
  const getInitialMessages = () => {
    try {
      const saved = localStorage.getItem('mindchat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convertir timestamps de string a Date
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    return [
      {
        id: 1,
        voice: 'system',
        text: 'Tus voces están listas. Cuéntales lo que quieras, te van a responder desde sus perspectivas.',
        timestamp: new Date()
      }
    ];
  };

  // Cargar messagesRemaining guardados
  const getInitialMessagesRemaining = () => {
    try {
      const saved = localStorage.getItem('mindchat_messages_remaining');
      return saved ? parseInt(saved, 10) : 10;
    } catch (error) {
      console.error('Error loading messages remaining:', error);
      return 10;
    }
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputText, setInputText] = useState('');
  const [messagesRemaining, setMessagesRemaining] = useState(getInitialMessagesRemaining);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Colores para las 8 voces (en orden)
  const voiceColors = [
    { color: '#3b82f6', textColor: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' },
    { color: '#8b5cf6', textColor: 'text-violet-400', bgColor: 'bg-violet-500/20', borderColor: 'border-violet-500' },
    { color: '#ec4899', textColor: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500' },
    { color: '#10b981', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500' },
    { color: '#f59e0b', textColor: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500' },
    { color: '#ef4444', textColor: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' },
    { color: '#06b6d4', textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500' },
    { color: '#6366f1', textColor: 'text-indigo-400', bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500' }
  ];

  // Mapear voces generadas con propiedades de UI
  const voices = generatedVoices.map((voz, index) => {
    // Mapeo de arquetipos viejos a IDs (backward compatibility)
    const arquetipoToIdMap = {
      'LÓGICA': 'logica',
      'Cable a Tierra': 'logica',
      'RETÓRICA': 'retorica',
      'Performance Social': 'retorica',
      'ELECTROCHEMISTRY': 'electrochemistry',
      'Motor de Impulsos': 'electrochemistry',
      'FÍSICO': 'fisico',
      'Monitor Corporal': 'fisico',
      'INTUICIÓN': 'intuicion',
      'Radar Interno': 'intuicion',
      'VOLICIÓN': 'volicion',
      'Fuerza de Voluntad': 'volicion',
      'EMPATÍA': 'empatia',
      'Sintonizador Emocional': 'empatia',
      'ANSIEDAD': 'ansiedad',
      'Sistema de Alarma': 'ansiedad'
    };

    return {
      id: arquetipoToIdMap[voz.arquetipo] || voz.arquetipo.toLowerCase().replace(/\s+/g, '-'),
      name: voz.arquetipo, // Arquetipo descriptivo
      shortName: voz.nombre_personaje, // Nombre personalizado
      initial: voz.nombre_personaje.substring(0, 2).toUpperCase(),
      personality: voz,
      ...voiceColors[index]
    };
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Guardar mensajes en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('mindchat_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [messages]);

  // Guardar messagesRemaining en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('mindchat_messages_remaining', messagesRemaining.toString());
    } catch (error) {
      console.error('Error saving messages remaining:', error);
    }
  }, [messagesRemaining]);

  // Generar respuestas de las voces usando el serverless function o mock (debug mode)
  const generateVoiceResponses = async (userMessage) => {
    // Si está en modo debug con chat mock, usar respuestas mock
    if (debugConfig && debugConfig.chatModel === 'mock') {
      return generateMockResponses(userMessage);
    }

    // Si no es mock, usar API real (determinar modelo)
    // debugConfig puede ser null (flujo normal) o contener el chatModel

    const modelToUse = debugConfig?.chatModel || 'haiku'; // Default: haiku

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userMessage: userMessage,
          voices: voices,
          userData: userData,
          conversationHistory: messages,
          model: modelToUse // Pasar el modelo específico
        })
      });

      if (!response.ok) {
        // Verificar si la respuesta es JSON antes de parsear
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al generar respuestas');
        } else {
          // Si no es JSON (ej: 504 timeout devuelve HTML)
          const errorText = await response.text();
          if (response.status === 504) {
            throw new Error('La respuesta tomó demasiado tiempo (timeout). Intenta de nuevo.');
          }
          throw new Error(`Error del servidor (${response.status}): ${errorText.substring(0, 100)}`);
        }
      }

      // Parsear respuesta JSON con manejo de errores
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('La respuesta del servidor no es válida. Intenta de nuevo.');
      }

      if (!data.success || !data.responses) {
        throw new Error('Respuesta inválida del servidor');
      }

      // Mapear las respuestas a formato de mensajes
      const responses = data.responses.map((r, index) => {
        const voice = voices.find(v => v.id === r.voice_id);
        if (!voice) {
          console.warn(`Voice with id ${r.voice_id} not found`);
          return null;
        }

        return {
          id: Date.now() + index + 1,
          voice: voice,
          text: r.text,
          timestamp: new Date(Date.now() + (index + 1) * 1000)
        };
      }).filter(r => r !== null);

      return responses;

    } catch (error) {
      console.error('Error generating voice responses:', error);

      // Fallback: respuestas de error
      return [
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'ansiedad') || voices[0],
          text: 'Uh oh, algo salió mal... ¿será culpa nuestra? 😰',
          timestamp: new Date()
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'logica') || voices[1],
          text: 'Error técnico. Probablemente un problema con el API. Intenta de nuevo.',
          timestamp: new Date(Date.now() + 1000)
        }
      ];
    }
  };

  // Generar respuestas mock para modo debug (no consume API)
  const generateMockResponses = (userMessage) => {
    const lowercaseMsg = userMessage.toLowerCase();
    const responses = [];

    // Detectar palabras clave y generar respuestas relevantes
    if (lowercaseMsg.includes('mensaje') || lowercaseMsg.includes('escribir') || lowercaseMsg.includes('mandar')) {
      responses.push(
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'ansiedad'),
          text: '¿Y si ya no le interesas? Han pasado como 6 horas desde su último mensaje... O peor, ¿y si vio tu mensaje y decidió ignorarlo? Literally puedo ver 47 timelines donde esto termina mal.',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'logica'),
          text: '@Doomscroll relax con los escenarios catastróficos. Hace 2 días te respondió normal y la conversación fluyó bien. No hay suficiente data para asumir desinterés. Probabilidad de ghosting: baja.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'electrochemistry'),
          text: 'Dale HAZLO YA, el suspense me está matando literally. @Axioma ok entiendo tus números pero necesito esa dopamina del "mensaje enviado" AHORA o voy a explotar.',
          timestamp: new Date(Date.now() + 2500)
        },
        {
          id: Date.now() + 4,
          voice: voices.find(v => v.id === 'retorica'),
          text: '@Síntesis esperá, el timing importa. Si mandás ahora vas a parecer desperate. Dejá que pasen al menos 2 horas más, después mandá algo casual tipo "hey qué onda" y listo. Todo sobre las optics.',
          timestamp: new Date(Date.now() + 3500)
        },
        {
          id: Date.now() + 5,
          voice: voices.find(v => v.id === 'empatia'),
          text: 'Capaz está ocupado o pasando por algo heavy. No todo es sobre vos (en el buen sentido). Dale espacio para que procese, @Encore tiene un punto con el timing pero desde la empatía, no desde la estrategia.',
          timestamp: new Date(Date.now() + 4500)
        },
        {
          id: Date.now() + 6,
          voice: voices.find(v => v.id === 'volicion'),
          text: '@Wavelength @Encore ambos tienen razón, pero la decisión final es tuya. Ya sabés qué querés hacer, solo falta que lo hagas. No dependas de la aprobación externa para actuar.',
          timestamp: new Date(Date.now() + 5500)
        },
        {
          id: Date.now() + 7,
          voice: voices.find(v => v.id === 'intuicion'),
          text: 'Honestamente siento que si le escribís ahora va a estar justo pensando en vos también. Es raro pero hay como un patrón emergente, una sincronicidad. Confía en el vibe.',
          timestamp: new Date(Date.now() + 6500)
        }
      );
    } else if (lowercaseMsg.includes('hambre') || lowercaseMsg.includes('comer') || lowercaseMsg.includes('comida')) {
      responses.push(
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'fisico'),
          text: 'Última comida hace 5 horas. Barra de estamina en amarillo, casi naranja. El avatar necesita mantenimiento urgente, no es opcional.',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'electrochemistry'),
          text: 'PIZZA o esas galletas que quedaron, lo que sea más rápido!!! @Estamina tiene razón pero el drop de glucosa me está matando, necesito carbohidratos NOW.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'logica'),
          text: '@Síntesis no, comiste chatarra ayer y anteayer. Algo con proteína y fibra sería más óptimo para mantener energía estable. Los carbos simples te van a dar crash en 2 horas.',
          timestamp: new Date(Date.now() + 2500)
        },
        {
          id: Date.now() + 4,
          voice: voices.find(v => v.id === 'volicion'),
          text: '@Axioma correcto, pero @Síntesis también tiene un punto. Compromiso: prepará algo rápido pero decente. Huevos revueltos, 5 minutos máximo. Podés hacerlo.',
          timestamp: new Date(Date.now() + 3500)
        },
        {
          id: Date.now() + 5,
          voice: voices.find(v => v.id === 'ansiedad'),
          text: 'Ok pero ¿y si no hay huevos? ¿Y si la cocina está sucia y tenés que lavar platos primero? Esto va a tomar 20 minutos mínimo... lowkey prefiero pedir delivery pero eso sale caro y...',
          timestamp: new Date(Date.now() + 4500)
        },
        {
          id: Date.now() + 6,
          voice: voices.find(v => v.id === 'retorica'),
          text: '@Doomscroll dejá el overthinking. La jugada es simple: levantate, revisá qué hay, hacé lo más fácil. Si es delivery, es delivery. No performés para nadie, solo comé.',
          timestamp: new Date(Date.now() + 5500)
        }
      );
    } else if (lowercaseMsg.includes('anxie') || lowercaseMsg.includes('ansied') || lowercaseMsg.includes('preocup')) {
      responses.push(
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'ansiedad'),
          text: '¿Ves? Yo SABÍA que algo andaba mal... O wait, ¿estoy overthinking de nuevo? Pero también podría no estar overthinking y realmente hay un problema... Literally no sé qué es peor.',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'empatia'),
          text: 'Es completamente válido sentirse así. No te juzgues tanto por estar preocupado, @Doomscroll. La ansiedad es una señal de que te importa, aunque esté amplificada. Tratá de sintonizar con qué es real y qué es ruido.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'volicion'),
          text: '@Wavelength exacto. Respirá profundo. Podés con esto. Enfócate en lo que SÍ podés controlar ahora mismo, no en los 47 timelines hipotéticos que @Doomscroll está scrolleando.',
          timestamp: new Date(Date.now() + 2500)
        },
        {
          id: Date.now() + 4,
          voice: voices.find(v => v.id === 'logica'),
          text: 'Separemos hechos de interpretaciones. Hecho: estás ansioso. Interpretación: "todo va mal". Necesitamos evidencia verificable para la segunda parte. @Covenant tiene razón, focus en lo controlable.',
          timestamp: new Date(Date.now() + 3500)
        },
        {
          id: Date.now() + 5,
          voice: voices.find(v => v.id === 'fisico'),
          text: 'Además llevás 3 horas sin moverte y probablemente sin tomar agua. La ansiedad se amplifica con recursos bajos. Pará, caminá 2 minutos, hidratate. Básico pero efectivo.',
          timestamp: new Date(Date.now() + 4500)
        },
        {
          id: Date.now() + 6,
          voice: voices.find(v => v.id === 'intuicion'),
          text: '@Estamina @Axioma ambos correct, pero también... siento que hay algo genuino en esta preocupación. No todo es overthinking. Hay un tremor real ahí, solo que está mezclado con ruido. Tratá de sentir cuál es cuál.',
          timestamp: new Date(Date.now() + 5500)
        }
      );
    } else {
      // Respuesta genérica - más voces participando
      const randomVoices = [...voices].sort(() => Math.random() - 0.5).slice(0, 6);
      responses.push(
        {
          id: Date.now() + 1,
          voice: randomVoices[0],
          text: 'Interesante. Déjame pensar en esto un segundo... Hay varias formas de abordarlo y necesito procesar cuál tiene más sentido para vos.',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: randomVoices[1],
          text: 'Ok pero, ¿esto realmente importa ahora mismo? Digo, entiendo que querés hablarlo pero también hay como 5 cosas más urgentes que deberías estar haciendo.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: randomVoices[2],
          text: '@' + randomVoices[1].shortName + ' sí importa, dejalo expresarse. No todo tiene que ser "productivo" o urgente. A veces solo necesitás procesar en voz alta y está perfecto.',
          timestamp: new Date(Date.now() + 2500)
        },
        {
          id: Date.now() + 4,
          voice: randomVoices[3],
          text: '@' + randomVoices[2].shortName + ' gracias, pero también @' + randomVoices[1].shortName + ' tiene un punto. Tal vez puedo hacer ambas cosas? Procesar esto MIENTRAS hago las otras cosas pendientes?',
          timestamp: new Date(Date.now() + 3500)
        },
        {
          id: Date.now() + 5,
          voice: randomVoices[4],
          text: 'Siento que todos están haciendo buenos puntos pero desde ángulos diferentes. Tal vez no es blanco o negro, sino encontrar el balance. Usual vibe cuando todos opinamos al mismo tiempo lol.',
          timestamp: new Date(Date.now() + 4500)
        },
        {
          id: Date.now() + 6,
          voice: randomVoices[5],
          text: '@' + randomVoices[4].shortName + ' exactamente. El balance es la clave. Y el hecho de que estés acá procesando esto con nosotros ya es un paso. Así que... ¿qué querés hacer realmente?',
          timestamp: new Date(Date.now() + 5500)
        }
      );
    }

    return responses;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || messagesRemaining <= 0) return;

    // Agregar mensaje del usuario
    const userMsg = {
      id: Date.now(),
      voice: 'user',
      text: inputText,
      timestamp: new Date()
    };

    const messageToSend = inputText;
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setMessagesRemaining(prev => prev - 1);
    setIsTyping(true);

    // Generar respuestas de las voces (ahora con API real)
    try {
      const responses = await generateVoiceResponses(messageToSend);

      // Agregar respuestas con delay visual
      responses.forEach((response, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, response]);
          if (index === responses.length - 1) {
            setIsTyping(false);
          }
        }, index * 1500);
      });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                MINDCHAT
              </h1>
              {debugConfig && (
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {/* Badge de Perfil */}
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono ${
                    debugConfig.profileType === 'mock'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500'
                  }`}>
                    {debugConfig.profileType === 'mock' ? '🎭 Mock' : `🤖 ${debugConfig.profileModel === 'sonnet' ? 'Sonnet' : 'Haiku'}`}
                  </span>

                  {/* Badge de Chat */}
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-mono ${
                    debugConfig.chatModel === 'mock'
                      ? 'bg-gray-600/50 text-gray-300 border border-gray-500'
                      : debugConfig.chatModel === 'sonnet'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500'
                      : 'bg-green-500/20 text-green-400 border border-green-500'
                  }`}>
                    {debugConfig.chatModel === 'mock' ? '💾 Mock' : debugConfig.chatModel === 'sonnet' ? '🔵 Sonnet' : '🟢 Haiku'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 truncate">
              {debugConfig && debugConfig.chatModel === 'mock' && 'Debug - Mock'}
              {debugConfig && debugConfig.chatModel !== 'mock' && `Debug - ${debugConfig.chatModel}`}
              {!debugConfig && 'Tu group chat interno'}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-[10px] sm:text-sm text-gray-400">Mensajes</div>
            <div className={`text-lg sm:text-2xl font-bold ${messagesRemaining <= 3 ? 'text-red-400' : 'text-green-400'}`}>
              {messagesRemaining}/10
            </div>
            <button
              onClick={onReset}
              className="mt-1 text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition underline"
            >
              Nueva sesión
            </button>
          </div>
        </div>
      </div>

      {/* Voces Sidebar/Pills */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-2 sm:p-4 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 flex-nowrap sm:flex-wrap pb-2 sm:pb-0">
            {voices.map(voice => (
              <div
                key={voice.id}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full ${voice.bgColor} border ${voice.borderColor} flex-shrink-0`}
              >
                <div
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white"
                  style={{ backgroundColor: voice.color }}
                >
                  {voice.initial}
                </div>
                <div>
                  <div className={`text-xs font-medium ${voice.textColor}`}>{voice.shortName}</div>
                  <div className="text-[10px] text-gray-500">{voice.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-32 sm:pb-36">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {messages.map(msg => {
            if (msg.voice === 'system') {
              return (
                <div key={msg.id} className="text-center">
                  <div className="inline-block bg-gray-800 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-gray-400">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.voice === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-3 sm:px-4 py-2 sm:py-3 rounded-lg max-w-[85%] sm:max-w-md">
                    <div className="text-white text-sm sm:text-base">{msg.text}</div>
                    <div className="text-xs text-gray-200 mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            }

            // Voice messages
            const voice = msg.voice;
            return (
              <div key={msg.id} className="flex gap-2 sm:gap-3">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0 mt-1"
                  style={{ backgroundColor: voice.color }}
                >
                  {voice.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 sm:gap-2 mb-1 flex-wrap">
                    <span className={`font-semibold text-sm ${voice.textColor}`}>
                      {voice.shortName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {voice.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {msg.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base">
                    {/* Parse @mentions */}
                    {msg.text.split(/(@[^\s,.!?;:]+)/g).map((part, i) => {
                      if (part.startsWith('@')) {
                        return (
                          <span key={i} className="text-blue-400 font-medium">
                            {part}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-500 text-xs sm:text-sm italic">Las voces están pensando...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          {messagesRemaining <= 0 ? (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-red-400 font-medium mb-2">
                Tus voces necesitan un break (y nosotros pagar el API)
              </p>
              <p className="text-sm text-gray-400 mb-3">
                Vuelve mañana o apóyanos en Ko-fi ☕
              </p>
              <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
                Apoyar en Ko-fi
              </button>
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe algo..."
                className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 resize-none focus:outline-none focus:border-purple-500 placeholder-gray-500 text-sm sm:text-base"
                rows="1"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
              >
                Enviar
              </button>
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500 text-center hidden sm:block">
            Usa @ para mencionar una voz específica • Shift + Enter para nueva línea
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
