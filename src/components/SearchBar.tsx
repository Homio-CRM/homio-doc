'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

export function SearchBar() {
  const { enabled, setOpenSearch } = useSearchContext();

  if (!enabled) {
    return null;
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-neutral-400" />
        </div>
        <button
          type="button"
          data-search-full=""
          onClick={() => setOpenSearch(true)}
          className="w-full bg-neutral-800/80 backdrop-blur-md rounded-xl border border-neutral-700/50 px-4 py-4 pl-12 pr-4 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-left cursor-pointer hover:border-neutral-600/50 transition-all"
        >
          <span className="text-neutral-400">Como posso desvincular um email</span>
        </button>
      </div>
    </div>
  );
}
