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
  const hasProcessedRef = useRef(false);

  // Auto-stop listening after 15 seconds and send data
  useEffect(() => {
    if (listening) {
      hasProcessedRef.current = false;
      const timer = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 15000);
      
      return () => clearTimeout(timer);
    } else {
      // When listening stops, send the transcript data
      if (transcript && !hasProcessedRef.current) {
        hasProcessedRef.current = true;
        console.log('Voice input stopped, sending transcript:', transcript);
        onVoiceData(transcript);
      }
    }
  }, [listening, transcript, onVoiceData]);

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
    // Data will be sent by the useEffect when listening becomes false
  };

  const handleClear = () => {
    resetTranscript();
    lastTranscriptRef.current = '';
    hasProcessedRef.current = false;
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
