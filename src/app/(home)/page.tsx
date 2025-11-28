import { SearchBar } from '@/components/SearchBar';
import { SupportDialog } from '@/components/SupportDialog';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-neutral-900">
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 -top-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/35 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/35 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-50 w-full sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="/logo-homio.png" 
                alt="Homio" 
                className="h-8 md:h-10"
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/docs"
                className="relative text-neutral-200 text-base md:text-lg hover:text-white transition-colors group/doc"
              >
                Documentação
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover/doc:w-full transition-all"></div>
              </Link>
              <span className="text-neutral-500">•</span>
              <SupportDialog />
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 py-16 md:py-24 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 text-center leading-tight tracking-tight bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Olá! Como podemos te ajudar?
          </h1>
          <p className="text-neutral-300 text-base md:text-lg mb-8 md:mb-10 text-center max-w-2xl px-4">
            Encontre respostas rápidas para suas dúvidas ou pesquise na documentação
          </p>
          
          <div className="w-full max-w-2xl px-4 mb-8 md:mb-12">
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="w-full bg-neutral-900">
        <div className="w-full max-w-7xl mx-auto px-6 pt-8 md:pt-19 pb-12 md:pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Documentações Mais Acessadas</h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Explore os guias mais populares para começar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/docs/Conversas/whatsapp"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">WhatsApp</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Conecte e configure WhatsApp Homio ou WhatsApp Meta</p>
            </Link>

            <Link 
              href="/docs/Conversas/contatos-e-conversas"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">Contatos</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Organize seus contatos e gerencie conversas</p>
            </Link>

            <Link 
              href="/docs/oportunidades"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">Oportunidades</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Gerencie oportunidades de negócio e vendas</p>
            </Link>

            <Link 
              href="/docs/pipelines"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">Funis</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Crie e gerencie pipelines de vendas</p>
            </Link>

            <Link 
              href="/docs/dashboards"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">Dashboards</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Visualize métricas e relatórios do seu negócio</p>
            </Link>

            <Link 
              href="/docs/Conversas/email"
              className="group relative bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">Email</h3>
                <svg className="w-5 h-5 text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-400 text-sm">Configure e gerencie campanhas de email</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
