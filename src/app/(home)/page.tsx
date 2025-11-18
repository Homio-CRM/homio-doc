import { SearchBar } from '@/components/SearchBar';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-neutral-900">
      <div className="relative z-20 w-full bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Image
            src="/logo-homio.png"
            alt="Homio"
            width={120}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-950 via-purple-950 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/25 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-700/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-700/25 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 py-16 md:py-24 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center leading-tight tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Olá! Como podemos te ajudar?
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 md:mb-10 text-center max-w-2xl px-4">
            Encontre respostas rápidas para suas dúvidas ou pesquise na documentação
          </p>
          
          <div className="w-full max-w-2xl px-4 mb-8 md:mb-12">
            <SearchBar />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-neutral-900/30 to-neutral-900 pointer-events-none"></div>
      </div>

      <div className="w-full bg-neutral-900 -mt-[1px]">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 1</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a primeira pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 2</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a segunda pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 3</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a terceira pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 4</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a quarta pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 5</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a quinta pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 6</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a sexta pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 7</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a sétima pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 8</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a oitava pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
            <div className="bg-neutral-800/60 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800/80 hover:border-neutral-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <h3 className="text-white font-semibold text-lg mb-3">Pergunta Placeholder 9</h3>
              <p className="text-neutral-300 text-sm leading-relaxed">Resposta placeholder para a nona pergunta frequente com mais detalhes sobre o assunto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
