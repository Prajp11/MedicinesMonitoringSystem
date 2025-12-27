import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            text: "Hello! I'm your Medicine Assistant. Ask me about any medicine, dosage, side effects, or health advice.",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive (only when scroll is enabled)
    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages-container-professional');
        if (messagesContainer && messagesContainer.classList.contains('enable-scroll')) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const messagesContainer = document.querySelector('.messages-container-professional');
        
        if (messagesContainer) {
            // Remove scroll initially
            messagesContainer.classList.remove('enable-scroll');
            
            // Use setTimeout to ensure DOM is fully rendered
            setTimeout(() => {
                const containerHeight = messagesContainer.clientHeight;
                const contentHeight = messagesContainer.scrollHeight;
                const hasRealOverflow = contentHeight > containerHeight + 20; // Add buffer
                const hasMultipleConversations = messages.length > 3; // Welcome + user + bot + more
                
                // Only enable scroll if we actually need it
                if (hasRealOverflow && hasMultipleConversations) {
                    messagesContainer.classList.add('enable-scroll');
                    scrollToBottom(); // Only scroll when scrollbar is enabled
                }
            }, 150);
        }
    }, [messages]);

    // Initialize Speech Recognition
    // Initialize Speech Recognition and ensure no initial scrollbar
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Ensure no scrollbar is shown initially
        setTimeout(() => {
            const messagesContainer = document.querySelector('.messages-container-professional');
            if (messagesContainer) {
                messagesContainer.classList.remove('enable-scroll');
            }
        }, 100);
    }, []);

    // Text-to-Speech function
    const speakMessage = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        }
    };

    // Stop speaking
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    // Start voice recognition
    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    // Stop voice recognition
    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Send message to Django backend
    const sendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim()) return;

        const userMessage = {
            text: messageText,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            console.log('Sending message to backend:', messageText);
            
            const response = await fetch('http://127.0.0.1:8000/api/chat_with_ai/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText
                })
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            const botMessage = {
                text: data.response || "I'm sorry, I couldn't process your request.",
                isBot: true,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            const errorMessage = {
                text: `Sorry, I'm having trouble connecting to the server. Error: ${error.message}`,
                isBot: true,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    // Handle key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format timestamp
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Quick suggestion buttons
    const quickSuggestions = [
        "Tell me about Paracetamol",
        "What is Ibuprofen used for?",
        "Side effects of Amoxicillin",
        "How to use Metformin?",
        "Medicine expiry information"
    ];

    const handleSuggestionClick = (suggestion) => {
        sendMessage(suggestion);
    };

    return (
        <div className="chatbot-professional-container">
            {/* Professional Header */}
            <div className="chatbot-professional-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="bot-avatar">
                            <span className="bot-icon">🤖</span>
                        </div>
                        <div className="header-text">
                            <h2>Medicine AI Assistant</h2>
                            <p className="subtitle">Your trusted healthcare companion</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="status-indicator online">
                            <span className="status-dot"></span>
                            <span className="status-text">Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container-professional">
                <div className="messages-wrapper">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message-professional ${message.isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
                        >
                            <div className="message-avatar">
                                {message.isBot ? (
                                    <div className="bot-avatar-small">🤖</div>
                                ) : (
                                    <div className="user-avatar-small">👤</div>
                                )}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    <p className="message-text">{message.text}</p>
                                    <div className="message-footer">
                                        <span className="message-time">
                                            {formatTime(message.timestamp)}
                                        </span>
                                        {message.isBot && (
                                            <button
                                                className="speak-btn-professional"
                                                onClick={() => speakMessage(message.text)}
                                                title="Read aloud"
                                                disabled={isSpeaking}
                                            >
                                                <span className="speaker-icon">🔊</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-professional bot">
                            <div className="message-avatar">
                                <div className="bot-avatar-small">🤖</div>
                            </div>
                            <div className="message-content">
                                <div className="message-bubble loading">
                                    <div className="typing-indicator-professional">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 1 && (
                <div className="quick-suggestions-professional">
                    <div className="suggestions-header">
                        <span className="suggestions-icon">💡</span>
                        <span className="suggestions-title">Quick Questions</span>
                    </div>
                    <div className="suggestions-grid-professional">
                        {quickSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="suggestion-btn-professional"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <span className="suggestion-text">{suggestion}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Professional Input Section */}
            <div className="input-section-professional">
                <div className="input-wrapper-professional">
                    <div className="input-field-container">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me about medicines, dosages, side effects..."
                            disabled={isLoading}
                            className="message-input-professional"
                            rows="1"
                        />
                    </div>
                    <div className="input-actions">
                        {recognitionRef.current && (
                            <button 
                                onClick={isListening ? stopListening : startListening} 
                                disabled={isLoading}
                                className={`action-btn voice-btn ${isListening ? 'listening' : ''}`}
                                title={isListening ? "Stop listening" : "Start voice input"}
                            >
                                {isListening ? '🔴' : '🎤'}
                            </button>
                        )}
                        <button 
                            onClick={handleSubmit} 
                            disabled={!inputMessage.trim() || isLoading}
                            className="action-btn send-btn-professional"
                            title="Send message"
                        >
                            {isLoading ? '⏳' : '➤'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Listening Indicator */}
            {isListening && (
                <div className="listening-indicator-professional">
                    <div className="listening-content">
                        <div className="listening-animation">
                            <div className="sound-wave"></div>
                            <div className="sound-wave"></div>
                            <div className="sound-wave"></div>
                        </div>
                        <span className="listening-text">Listening...</span>
                    </div>
                </div>
            )}

            {/* Speaking Indicator */}
            {isSpeaking && (
                <div className="speaking-indicator-professional">
                    <div className="speaking-content">
                        <span className="speaking-icon">🔊</span>
                        <span className="speaking-text">Speaking...</span>
                        <button 
                            onClick={stopSpeaking}
                            className="stop-speaking-btn"
                        >
                            Stop
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;