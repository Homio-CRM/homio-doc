'use client';

import type { UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import ReactMarkdown from 'react-markdown';

function getMessageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .filter((text) => text.length > 0)
    .join('\n');
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

const suggestedQuestions = [
  'Como configurar notificações por email?',
  'Como criar um pipeline de vendas?',
  'Como usar campos personalizados?',
  'Como integrar WhatsApp?'
];

export function AISearchTrigger() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isLoading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!value || isLoading) return;
    try {
      await sendMessage({ text: value });
      setInput('');
      setSubmitError(null);
    } catch {
      setSubmitError('Não foi possível enviar sua mensagem.');
    }
  }

  async function handleSuggestionClick(question: string) {
    if (isLoading) return;
    try {
      await sendMessage({ text: question });
      setSubmitError(null);
    } catch {
      setSubmitError('Não foi possível enviar sua mensagem.');
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="Pergunte à IA - Assistente Liv"
        >
          <Sparkles className="h-5 w-5 md:h-6 md:w-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-1.5rem)] sm:w-[400px] md:w-[480px] max-h-[calc(100vh-6rem)] sm:max-h-[600px] flex flex-col p-0 backdrop-blur-xl bg-white/95 border-2 border-blue-200/50 shadow-2xl rounded-2xl overflow-hidden" 
        align="end"
        side="top"
        sideOffset={8}
      >
        <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 truncate">Pergunte a Liv</h2>
              <p className="text-[11px] sm:text-xs text-neutral-600 truncate">
                Assistente de documentação do Homio
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-white to-blue-50/30">
          <div className="space-y-3 sm:space-y-4 min-h-[180px]">
            {messages.length === 0 && (
              <div className="text-sm text-center py-4 sm:py-8 animate-fade-in">
                <div className="mb-4 sm:mb-6">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <p className="font-semibold text-neutral-900 text-sm sm:text-base mb-1.5 sm:mb-2">
                    Olá! Como posso ajudar?
                  </p>
                  <p className="text-[11px] sm:text-xs text-neutral-600 max-w-sm mx-auto px-2">
                    Estou aqui para responder suas dúvidas sobre o sistema Homio
                  </p>
                </div>
                
                <div className="space-y-2 mt-4 sm:mt-6">
                  <p className="text-xs font-semibold text-neutral-700 mb-2 sm:mb-3">Perguntas sugeridas:</p>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      disabled={isLoading}
                      className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-xs sm:text-sm text-neutral-700 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-500 group-hover:text-blue-600 flex-shrink-0" />
                        <span className="flex-1 leading-snug">{question}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 animate-slide-in ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[90%] shadow-sm transition-all duration-200 hover:shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm'
                      : 'bg-white text-neutral-900 border-2 border-blue-100 rounded-bl-sm'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {getMessageText(message)}
                    </p>
                  ) : (
                    <div className="text-sm break-words markdown-content prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="my-2 text-neutral-900 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-neutral-900">{children}</strong>,
                          em: ({ children }) => <em className="italic text-neutral-800">{children}</em>,
                          h1: ({ children }) => <h1 className="text-base font-bold text-neutral-900 mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-sm font-bold text-neutral-900 mt-3 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold text-neutral-900 mt-2 mb-1">{children}</h3>,
                          ul: ({ children }) => <ul className="list-disc list-inside my-2 text-neutral-900 space-y-1 ml-2 [&_p]:my-0">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside my-2 text-neutral-900 space-y-1 ml-2 [&_p]:my-0">{children}</ol>,
                          li: ({ children }) => <li className="text-neutral-900 leading-relaxed [&>p]:inline">{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-neutral-900 text-white p-3 rounded-lg text-xs overflow-x-auto my-3 font-mono">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 my-3 text-neutral-700 italic bg-blue-50 py-2 rounded-r">
                              {children}
                            </blockquote>
                          ),
                          a: ({ href, children }) => (
                            <a 
                              href={href} 
                              className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {getMessageText(message)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 px-2">
                  {message.createdAt ? formatTime(message.createdAt) : formatTime(new Date())}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-2 animate-slide-in">
                <div className="bg-white text-neutral-900 border-2 border-blue-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-neutral-600">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-blue-100 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Digite sua pergunta..."
              className="flex-1 rounded-xl border-2 border-blue-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
              autoComplete="off"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-2 group shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
          {(submitError || error) && (
            <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              {submitError || error?.message}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

