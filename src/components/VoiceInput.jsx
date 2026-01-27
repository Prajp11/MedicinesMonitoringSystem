import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/**
 * VoiceInput Component
 * Provides voice-to-text functionality for form inputs
 * @param {function} onVoiceData - Callback when voice data is captured
 * @param {string} placeholder - Placeholder text for the button
 * @param {boolean} showTranscript - Whether to display the transcript
 */
const VoiceInput = ({ 
  onVoiceData, 
  placeholder = "Click to speak", 
  showTranscript = true 
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const lastTranscriptRef = useRef('');

  // Auto-stop listening after 5 seconds of silence
  useEffect(() => {
    if (listening) {
      const timer = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="voice-input-container">
        <small style={{ color: '#e74c3c' }}>
          ⚠️ Voice input not supported in this browser. Try Chrome or Edge.
        </small>
      </div>
    );
  }

  const handleStartListening = () => {
    resetTranscript();
    lastTranscriptRef.current = '';
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US' 
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    
    // Send data only if transcript changed and is not empty
    if (transcript && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript;
      onVoiceData(transcript);
    }
  };

  const handleClear = () => {
    resetTranscript();
    lastTranscriptRef.current = '';
  };

  return (
    <div className="voice-input-container">
      <div className="voice-controls">
        <button
          type="button"
          className={`voice-button ${listening ? 'listening' : ''}`}
          onClick={listening ? handleStopListening : handleStartListening}
          title={listening ? 'Stop listening' : 'Start voice input'}
        >
          <span className="mic-icon">🎤</span>
          <span className="voice-text">
            {listening ? 'Listening...' : 'Voice Input'}
          </span>
        </button>
        
        {transcript && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            title="Clear transcript"
          >
            ✕
          </button>
        )}
      </div>
      
      {showTranscript && transcript && (
        <div className="voice-transcript">
          <small className="transcript-label">You said:</small>
          <p className="transcript-text">"{transcript}"</p>
        </div>
      )}
      
      {listening && (
        <div className="voice-indicator">
          <span className="pulse-dot"></span>
          <small>Listening... Speak now</small>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
