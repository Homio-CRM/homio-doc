import { SearchBar } from '@/components/SearchBar';
import Image from 'next/image';
import Script from 'next/script';

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-white">
      <div className="relative z-20 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0">
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
      
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400/15 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-400/15 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 py-16 md:py-24 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 md:mb-6 text-center leading-tight tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Olá! Como podemos te ajudar?
          </h1>
          <p className="text-neutral-700 text-base md:text-lg mb-8 md:mb-10 text-center max-w-2xl px-4">
            Encontre respostas rápidas para suas dúvidas ou pesquise na documentação
          </p>
          
          <div className="w-full max-w-2xl px-4 mb-8 md:mb-12">
            <SearchBar />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/30 to-white pointer-events-none"></div>
      </div>

      <div className="w-full bg-white -mt-[1px]">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Agendar Reunião de Suporte</h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Escolha um horário conveniente para conversar com nossa equipe
            </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto">
            <iframe 
              src="https://stage.homio.com.br/widget/booking/uqujviQTmX7nQMaWQAn6" 
              style={{ width: '100%', border: 'none', overflow: 'hidden' }} 
              scrolling="no" 
              id="uqujviQTmX7nQMaWQAn6_1763520121835"
              className="w-full"
            />
          </div>
        </div>
      </div>
      <Script 
        src="https://stage.homio.com.br/js/form_embed.js" 
        strategy="afterInteractive"
      />
    </div>
  );
}
