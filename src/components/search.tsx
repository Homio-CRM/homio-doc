'use client';

import type { UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { MessageSquare } from 'lucide-react';
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

export function AISearchTrigger() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isLoading = status === 'submitted' || status === 'streaming';

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow`}
          aria-label="Ask AI"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="max-w-xl max-h-[85vh] flex flex-col w-[90vw] p-0 backdrop-blur-none bg-white border-gray-300" 
        align="end"
        side="top"
      >
        <div className="px-6 pt-6 pb-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-black">Pergunte a Liv</h2>
          <p className="text-xs text-gray-600 mt-1">
            Assistente de documentação do Homio
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4 min-h-[200px]">
            {messages.length === 0 && (
              <div className="text-sm text-gray-600 text-center py-12">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50 text-gray-400" />
                <p className="font-medium text-black">Pergunte-me qualquer coisa sobre a documentação!</p>
                <p className="text-xs mt-2 text-gray-500">
                  Estou aqui para ajudar você a encontrar informações sobre o sistema Homio.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-2 ${
                  message.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2.5 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-black border border-gray-300'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {getMessageText(message)}
                    </p>
                  ) : (
                    <div className="text-sm break-words markdown-content">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="my-2 text-black">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
                          em: ({ children }) => <em className="italic text-black">{children}</em>,
                          h1: ({ children }) => <h1 className="text-lg font-semibold text-black mt-4 mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-semibold text-black mt-3 mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-semibold text-black mt-2 mb-1">{children}</h3>,
                          ul: ({ children }) => <ul className="list-disc list-inside my-2 text-black space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside my-2 text-black space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-black">{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-gray-200 px-1 rounded text-black text-xs">{children}</code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-gray-200 p-2 rounded text-black text-xs overflow-x-auto my-2">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-400 pl-3 my-2 text-black italic">{children}</blockquote>,
                          a: ({ href, children }) => <a href={href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }}
                      >
                        {getMessageText(message)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-gray-100 text-black border border-gray-300 rounded-lg px-4 py-2.5">
                  <p className="text-sm">Pensando...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 pb-6 pt-4 border-t border-gray-300">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Faça uma pergunta sobre a documentação..."
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-500 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className={buttonVariants({ variant: 'primary' })}
            >
              Enviar
            </button>
          </form>
          {(submitError || error) && (
            <p className="text-sm text-red-600 mt-2">
              {submitError || error?.message}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

