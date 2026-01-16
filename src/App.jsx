import { useState } from 'react'
import Onboarding from './components/Onboarding'
import VoiceGenerator from './components/VoiceGenerator'
import Chat from './components/Chat'

function App() {
  const [currentView, setCurrentView] = useState('onboarding') // onboarding | generator | chat
  const [userData, setUserData] = useState(null)
  const [generatedVoices, setGeneratedVoices] = useState(null)

  const handleOnboardingComplete = (data) => {
    setUserData(data)
    setCurrentView('generator')
  }

  const handleVoicesGenerated = (voices) => {
    setGeneratedVoices(voices)
    setCurrentView('chat')
  }

  const resetApp = () => {
    setCurrentView('onboarding')
    setUserData(null)
    setGeneratedVoices(null)
  }

  return (
    <div className="app">
      {currentView === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      {currentView === 'generator' && (
        <VoiceGenerator 
          userData={userData}
          onVoicesGenerated={handleVoicesGenerated}
        />
      )}
      
      {currentView === 'chat' && (
        <Chat 
          voices={generatedVoices}
          userData={userData}
          onReset={resetApp}
        />
      )}
    </div>
  )
}

export default App
