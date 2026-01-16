import React, { useState, useRef, useEffect } from 'react';

const Chat = ({ voices: generatedVoices, userData, onReset, debugMode = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      voice: 'system',
      text: 'Tus voces están listas. Cuéntales lo que quieras, te van a responder desde sus perspectivas.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [messagesRemaining, setMessagesRemaining] = useState(50);
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
    const arquetipoMap = {
      'LÓGICA': 'logica',
      'RETÓRICA': 'retorica',
      'ELECTROCHEMISTRY': 'electrochemistry',
      'FÍSICO': 'fisico',
      'INTUICIÓN': 'intuicion',
      'VOLICIÓN': 'volicion',
      'EMPATÍA': 'empatia',
      'ANSIEDAD': 'ansiedad'
    };
    
    return {
      id: arquetipoMap[voz.arquetipo] || voz.arquetipo.toLowerCase(),
      name: voz.arquetipo,
      shortName: voz.nombre_personaje,
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

  // Generar respuestas de las voces usando el serverless function o mock (debug mode)
  const generateVoiceResponses = async (userMessage) => {
    // Si está en modo debug full-mock, usar respuestas mock
    if (debugMode === 'full-mock') {
      return generateMockResponses(userMessage);
    }

    // Si está en modo hybrid o normal, usar API real

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
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar respuestas');
      }

      const data = await response.json();

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
          text: '¿Y si ya no le interesas? Han pasado como 6 horas desde su último mensaje...',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'logica'),
          text: '@El Catastrofista relax, hace 2 días te respondió normal. No hay data que sugiera desinterés.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'electrochemistry'),
          text: 'Dale HAZLO YA, el suspense me está matando literally.',
          timestamp: new Date(Date.now() + 2500)
        }
      );
    } else if (lowercaseMsg.includes('hambre') || lowercaseMsg.includes('comer') || lowercaseMsg.includes('comida')) {
      responses.push(
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'fisico'),
          text: 'Última comida hace 5 horas. Come algo ya.',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'electrochemistry'),
          text: 'PIZZA o esas galletas que quedaron, lo que sea más rápido!!!',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'logica'),
          text: '@El Impulso no, comiste chatarra ayer. Algo con proteína sería más óptimo.',
          timestamp: new Date(Date.now() + 2500)
        }
      );
    } else if (lowercaseMsg.includes('anxie') || lowercaseMsg.includes('ansied') || lowercaseMsg.includes('preocup')) {
      responses.push(
        {
          id: Date.now() + 1,
          voice: voices.find(v => v.id === 'ansiedad'),
          text: '¿Ves? Yo sabía que algo andaba mal... ¿o no??',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: voices.find(v => v.id === 'empatia'),
          text: 'Es válido sentirse así. No te juzgues tanto por estar preocupado.',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: voices.find(v => v.id === 'volicion'),
          text: 'Respirá. Podés con esto. Enfócate en lo que SÍ podés controlar.',
          timestamp: new Date(Date.now() + 2500)
        }
      );
    } else {
      // Respuesta genérica
      const randomVoices = [...voices].sort(() => Math.random() - 0.5).slice(0, 3);
      responses.push(
        {
          id: Date.now() + 1,
          voice: randomVoices[0],
          text: 'Interesante. Déjame pensar en esto...',
          timestamp: new Date(Date.now() + 500)
        },
        {
          id: Date.now() + 2,
          voice: randomVoices[1],
          text: 'Ok pero, ¿esto realmente importa ahora mismo?',
          timestamp: new Date(Date.now() + 1500)
        },
        {
          id: Date.now() + 3,
          voice: randomVoices[2],
          text: '@' + randomVoices[1].shortName + ' sí importa, dejalo expresarse.',
          timestamp: new Date(Date.now() + 2500)
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
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                MINDCHAT
              </h1>
              {debugMode === 'full-mock' && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500 px-2 py-1 rounded font-mono">
                  🐛 FULL MOCK
                </span>
              )}
              {debugMode === 'hybrid' && (
                <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500 px-2 py-1 rounded font-mono">
                  🔄 HYBRID
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              {debugMode === 'full-mock' && 'Modo debug - Perfil preset + respuestas mock (no consume API)'}
              {debugMode === 'hybrid' && 'Modo debug - Perfil preset + respuestas reales (consume API)'}
              {!debugMode && 'Tu group chat interno'}
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Mensajes restantes</div>
            <div className={`text-2xl font-bold ${messagesRemaining <= 10 ? 'text-red-400' : 'text-green-400'}`}>
              {messagesRemaining}/50
            </div>
          </div>
        </div>
      </div>

      {/* Voces Sidebar/Pills */}
      <div className="bg-gray-800/50 border-b border-gray-700 p-4 overflow-x-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {voices.map(voice => (
              <div
                key={voice.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-full ${voice.bgColor} border ${voice.borderColor}`}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
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
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => {
            if (msg.voice === 'system') {
              return (
                <div key={msg.id} className="text-center">
                  <div className="inline-block bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-400">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.voice === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 rounded-lg max-w-md">
                    <div className="text-white">{msg.text}</div>
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
              <div key={msg.id} className="flex gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1"
                  style={{ backgroundColor: voice.color }}
                >
                  {voice.initial}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`font-semibold text-sm ${voice.textColor}`}>
                      {voice.shortName}
                    </span>
                    <span className="text-xs text-gray-500">{voice.name}</span>
                    <span className="text-xs text-gray-600">
                      {msg.timestamp.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    {/* Parse @mentions */}
                    {msg.text.split(/(@[\w\s]+)/g).map((part, i) => {
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
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-500 text-sm italic">Las voces están pensando...</div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
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
            <div className="flex gap-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe algo a tus voces..."
                className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 resize-none focus:outline-none focus:border-purple-500 placeholder-gray-500"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Usa @ para mencionar una voz específica • Shift + Enter para nueva línea
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
