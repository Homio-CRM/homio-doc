import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Geist, Geist_Mono } from 'next/font/google';
import { AISearchTrigger } from '@/components/search';
import type { Metadata } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/simbolo-grafite.png', media: '(prefers-color-scheme: light)' },
      { url: '/simbolo-off.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
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
