/**
 * Root - Global wrapper component for Docusaurus
 *
 * This component wraps the entire Docusaurus application,
 * handling the chatbot, text selection, and the "Chat with AI" button.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// --- NEW Text Selection Button Component (Internalized) ---
const TextSelectionButton = ({ position, onClick, onClear }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Effect to handle clicks outside the button to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        onClear();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClear]);
  
  if (!position) return null;

  return (
    <button
      ref={buttonRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
      }}
      onClick={onClick}
      aria-label="Chat with AI about selected text"
    >
      💬 Chat with AI
    </button>
  );
};


// --- Main Root Component ---
export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{x: number, y: number} | null>(null);

  const { siteConfig } = useDocusaurusContext();
  const pythonBackendUrl = `https://abdullahcoder54-hackaton1-book-chatbot.hf.space/api/query`

  // --- Text Selection Logic ---
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';

    if (text && text.length > 10 && text.length < 2000) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionPosition({
        x: rect.left + window.scrollX + rect.width / 2 - 60, // Center the button
        y: rect.top + window.scrollY - 40, // Position above the selection
      });
    } else {
      // If selection is invalid, don't clear it immediately, 
      // let the outside click handle it so the button can be clicked.
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]);

  const clearSelection = useCallback(() => {
    setSelectedText('');
    setSelectionPosition(null);
    window.getSelection()?.removeAllRanges();
  }, []);


  // --- Chat Logic ---
  const handleOpenChat = () => {
    setIsOpen(true);
    setSelectionPosition(null); // Hide button when chat opens
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    clearSelection(); // Also clear selection when chat is closed
  };
  
  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!pythonBackendUrl) {
        throw new Error('Chatbot backend URL is not configured.');
      }
      
      const response = await fetch(pythonBackendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, selected_text: selectedText }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status} - ${await response.text()}`);
      
      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response, sources: data.sources, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage = { role: 'assistant', content: `❌ **Error**: ${err.message}`, timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      clearSelection(); // Clear selection after the query is sent
    }
  };

  // --- Render ---
  return (
    <>
      {children}

      <TextSelectionButton 
        position={selectionPosition}
        onClick={handleOpenChat}
        onClear={clearSelection}
      />

      {/* Main floating chatbot icon is now only for opening an empty chat */}
      <button
        className="chatbot-icon"
        onClick={() => {
          clearSelection(); // Make sure no text is selected
          setIsOpen(true);
        }}
        aria-label="Open chatbot"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          cursor: 'pointer',
          color: 'white',
          fontSize: '24px',
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div
          className="chatbot-overlay"
          onClick={handleCloseChat}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
          }}
        >
          <div className="chatbot-modal" onClick={e => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '600px', height: '80vh', maxHeight: '700px', background: 'white',
              borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', display: 'flex',
              flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>💬 Textbook Assistant</h3>
              <button onClick={handleCloseChat} style={{ background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedText && (
                <div style={{ padding: '0.5rem', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #cce5ff', color: '#004085', fontSize: '0.9em' }}>
                  <p style={{margin: 0}}><strong>Context:</strong> "{selectedText.substring(0, 150)}..."</p>
                </div>
              )}
              {messages.length === 0 && !selectedText && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <p>👋 Hi! I'm your Physical AI textbook assistant.</p>
                  <p>Ask me anything about the course content!</p>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '80%', padding: '1rem 1.25rem', borderRadius: '16px', background: msg.role === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9', color: msg.role === 'user' ? 'white' : '#1e293b' }}>
                    <p style={{ margin: 0 }}>{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '1rem 1.25rem', borderRadius: '16px', background: '#f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>⏳</span>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); const input = e.currentTarget.question; sendMessage(input.value); input.value = ''; }}
              style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem' }}
            >
              <input name="question" type="text" placeholder={selectedText ? "Ask about the selected text..." : "Ask a question..."} disabled={isLoading} style={{ flex: 1, border: '2px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem 1rem', fontSize: '0.95rem', outline: 'none' }} />
              <button type="submit" disabled={isLoading} style={{ width: '48px', height: '48px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}>➤</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
