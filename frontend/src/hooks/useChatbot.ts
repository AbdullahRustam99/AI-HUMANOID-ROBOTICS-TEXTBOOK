/**
 * useChatbot - Custom hook for chatbot functionality
 *
 * Manages chat state, API calls to backend, and error handling.
 */
import { useState, useCallback } from 'react';

// Type definitions
export interface SourceCitation {
  chunk_id: string;
  chapter_id: number;
  section_id: string;
  section_title: string;
  preview_text: string;
  relevance_score: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: Date;
}

interface QueryResponse {
  response: string;
  sources: SourceCitation[];
  query_time_ms: number;
}

interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (question: string) => Promise<void>;
  clearMessages: () => void;
  isOpen: boolean;
  toggleOpen: () => void;
  selectedText: string | null;
  setSelectedText: (text: string | null) => void;
}

// Use a relative path for the API endpoint.
// This works for both local dev and Vercel deployment.
const API_ENDPOINT = '/api/query';

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          selected_text: selectedText, // Pass selectedText if available
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error('Failed to get response. Please try again.');
        }
      }

      const data: QueryResponse = await response.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      // Add error as assistant message
      const errorAssistantMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isOpen,
    toggleOpen,
    selectedText,
    setSelectedText,
  };
}
