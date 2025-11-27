import { SearchBar } from '@/components/SearchBar';
import { SupportDialog } from '@/components/SupportDialog';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-white">
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 overflow-hidden">
        <div className="absolute inset-0 -top-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-400/15 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-400/15 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-20 w-full sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Link 
                href="/docs"
                className="text-neutral-700 text-base md:text-lg hover:text-neutral-900 transition-colors"
              >
                Documentação
              </Link>
              <span className="text-neutral-400">•</span>
              <SupportDialog />
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 py-16 md:py-24 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 md:mb-6 text-center leading-tight tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
        <div className="w-full max-w-7xl mx-auto px-6 pt-2 md:pt-4 pb-12 md:pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Documentações Mais Acessadas</h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              Explore os guias mais populares para começar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/docs/Conversas/whatsapp"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">WhatsApp</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Conecte e configure WhatsApp Homio ou WhatsApp Meta</p>
            </Link>

            <Link 
              href="/docs/Conversas/contatos-e-conversas"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Contatos</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Organize seus contatos e gerencie conversas</p>
            </Link>

            <Link 
              href="/docs/oportunidades"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Oportunidades</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Gerencie oportunidades de negócio e vendas</p>
            </Link>

            <Link 
              href="/docs/pipelines"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Funis</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Crie e gerencie pipelines de vendas</p>
            </Link>

            <Link 
              href="/docs/dashboards"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Dashboards</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Visualize métricas e relatórios do seu negócio</p>
            </Link>

            <Link 
              href="/docs/Conversas/email"
              className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">Email</h3>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-neutral-600 text-sm">Configure e gerencie campanhas de email</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
