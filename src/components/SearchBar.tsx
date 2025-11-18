'use client';

import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  url: string;
  title: string;
  description?: string;
  breadcrumbs?: string[];
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setIsSearching(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          setResults([]);
          return;
        }
        
        const data = await response.json();
        
        let searchResults: SearchResult[] = [];
        
        if (data.hits && Array.isArray(data.hits)) {
          searchResults = data.hits.map((hit: any) => {
            const doc = hit.document || hit;
            const url = doc.url || doc.id || '';
            const title = doc.title || doc.name || doc.section || '';
            const description = doc.description || doc.content || doc.text || '';
            const breadcrumbs = doc.breadcrumbs || (doc.section ? [doc.section] : []);
            
            return {
              id: doc.id || url || String(Math.random()),
              url: url.startsWith('/') ? url : `/${url}`,
              title: title || 'Sem título',
              description: description,
              breadcrumbs: Array.isArray(breadcrumbs) ? breadcrumbs : [],
            };
          }).filter((result: SearchResult) => result.url && result.title);
        } else if (Array.isArray(data)) {
          searchResults = data.map((item: any) => {
            const url = item.url || item.id || '';
            const title = item.title || item.name || item.section || '';
            const description = item.description || item.content || item.text || '';
            const breadcrumbs = item.breadcrumbs || (item.section ? [item.section] : []);
            
            return {
              id: item.id || url || String(Math.random()),
              url: url.startsWith('/') ? url : `/${url}`,
              title: title || 'Sem título',
              description: description,
              breadcrumbs: Array.isArray(breadcrumbs) ? breadcrumbs : [],
            };
          }).filter((result: SearchResult) => result.url && result.title);
        } else if (data.results && Array.isArray(data.results)) {
          searchResults = data.results.map((item: any) => {
            const url = item.url || item.id || '';
            const title = item.title || item.name || item.section || '';
            const description = item.description || item.content || item.text || '';
            const breadcrumbs = item.breadcrumbs || (item.section ? [item.section] : []);
            
            return {
              id: item.id || url || String(Math.random()),
              url: url.startsWith('/') ? url : `/${url}`,
              title: title || 'Sem título',
              description: description,
              breadcrumbs: Array.isArray(breadcrumbs) ? breadcrumbs : [],
            };
          }).filter((result: SearchResult) => result.url && result.title);
        }
        
        setResults(searchResults);
      } catch (error) {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-neutral-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setShowResults(true)}
          placeholder="Como posso desvincular um email"
          className="w-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 px-4 py-4 pl-12 pr-4 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 text-lg shadow-lg"
        />
      </div>

      {showResults && (query.trim().length > 0 || results.length > 0) && (
        <div className="absolute top-full mt-3 w-full bg-neutral-900/95 backdrop-blur-md rounded-xl border border-neutral-700/50 shadow-2xl max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-6 text-center text-neutral-400">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Pesquisando...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={result.id || index}
                  href={result.url}
                  onClick={() => {
                    setQuery('');
                    setShowResults(false);
                  }}
                  className="block px-5 py-4 hover:bg-neutral-800/80 transition-colors border-b border-neutral-800/50 last:border-b-0"
                >
                  {result.breadcrumbs && result.breadcrumbs.length > 0 && (
                    <div className="text-neutral-500 text-xs mb-2 font-medium">
                      {result.breadcrumbs.join(' / ')}
                    </div>
                  )}
                  <div className="text-white font-semibold mb-2 text-base">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-neutral-400 text-sm leading-relaxed">
                      {result.description.length > 120 
                        ? result.description.substring(0, 120) + '...'
                        : result.description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-neutral-400">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}

