import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { AISearchTrigger } from '@/components/search';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === undefined || localStorage.theme === 'system') {
                  localStorage.theme = 'light';
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider
          search={{
            enabled: true,
            options: {
              api: '/api/search',
              type: 'fetch',
              delayMs: 300,
            },
          }}
          i18n={{
            locale: 'pt-BR',
            translations: {
              search: 'Pesquisa',
              toc: 'Nessa página',
              searchNoResult: 'Nenhum resultado encontrado',
              tocNoHeadings: 'Sem títulos',
              lastUpdate: 'Última atualização',
              chooseLanguage: 'Escolher idioma',
              nextPage: 'Próxima',
              previousPage: 'Anterior',
              chooseTheme: 'Escolher tema',
              editOnGithub: 'Editar no GitHub',
            },
          }}
        >
          <AISearchTrigger />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
