'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Clapperboard, FileText, Loader2, Play, Search, X } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { SupportDialog } from '@/components/SupportDialog';
import {
  CONSULTA_MAXIMA,
  type AssuntoEmProducao,
  type RespostaBusca,
  type TrechoEncontrado,
} from '@/lib/universidade-busca';
import { CopiarLink } from './CopiarLink';
import { CopiarResposta } from './CopiarResposta';
import { EVENTO_SUPORTE, modoSuporteAtivo } from './ModoSuporte';

interface Props {
  /** frases de cliente do catálogo, pra quem não sabe por onde começar */
  exemplos: string[];
}

interface Achado {
  consulta: string;
  trechos: TrechoEncontrado[];
  emProducao: AssuntoEmProducao[];
}

type Estado =
  | { fase: 'parado' }
  | { fase: 'buscando' }
  | ({ fase: 'pronto' } & Achado)
  | { fase: 'erro' };

function duracao(segundos?: number): string {
  if (!segundos) return '';
  if (segundos < 60) return `${segundos} s`;
  const s = segundos % 60;
  return s ? `${Math.floor(segundos / 60)} min ${s} s` : `${Math.floor(segundos / 60)} min`;
}

/** com menos letras que isso a palavra ainda está pela metade: busca, mas não diz "não achei" */
const CONSULTA_COMPLETA = 4;

const ACAO_SECUNDARIA =
  'inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:min-h-9';

const LINK_EM_LINHA =
  'inline-flex min-h-11 items-center font-medium text-fd-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:min-h-0';

/**
 * Campo "O que deu errado?" da capa da Universidade. A pessoa escreve o sintoma do
 * jeito que fala ("whatsapp desconectou") e recebe os trechos que resolvem, cada um
 * levando direto à âncora. Os resultados entram no fluxo da página, sob o campo (não
 * é um menu flutuante: no celular o teclado já ocupa metade da tela). Setas e Enter
 * navegam; Esc limpa. A consulta fica em `?q=`, então voltar do trecho devolve a lista.
 * Com o modo suporte ligado, cada resultado ganha "copiar link" e "copiar resposta".
 */
export function BuscaSintoma({ exemplos }: Props) {
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<Estado>({ fase: 'parado' });
  const [ultimos, setUltimos] = useState<Achado | null>(null);
  const [ativo, setAtivo] = useState(0);
  const [suporte, setSuporte] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setOpenSearch } = useSearchContext();
  const id = useId();
  const idLista = `${id}-lista`;

  // consulta que veio na URL (voltar do trecho, ou link compartilhado pelo suporte)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setTexto(q.slice(0, CONSULTA_MAXIMA));
  }, []);

  useEffect(() => {
    const ler = () => setSuporte(modoSuporteAtivo());
    ler();
    window.addEventListener(EVENTO_SUPORTE, ler);
    window.addEventListener('storage', ler);
    return () => {
      window.removeEventListener(EVENTO_SUPORTE, ler);
      window.removeEventListener('storage', ler);
    };
  }, []);

  const consulta = texto.trim();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (consulta) url.searchParams.set('q', consulta);
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url);

    if (consulta.length < 2) {
      setEstado({ fase: 'parado' });
      setUltimos(null);
      return;
    }
    const controle = new AbortController();
    const espera = window.setTimeout(async () => {
      setEstado({ fase: 'buscando' });
      try {
        const parametros = new URLSearchParams({ q: consulta });
        if (suporte) parametros.set('suporte', '1');
        const resposta = await fetch(`/api/universidade/buscar?${parametros}`, {
          signal: controle.signal,
        });
        if (!resposta.ok) throw new Error(String(resposta.status));
        const dados = (await resposta.json()) as RespostaBusca;
        const pronto = { consulta, trechos: dados.trechos, emProducao: dados.emProducao ?? [] };
        setUltimos(pronto);
        setEstado({ fase: 'pronto', ...pronto });
        setAtivo(0);
      } catch (erro) {
        if ((erro as Error).name !== 'AbortError') setEstado({ fase: 'erro' });
      }
    }, 160);
    return () => {
      window.clearTimeout(espera);
      controle.abort();
    };
  }, [consulta, suporte]);

  // enquanto a próxima resposta não chega, a lista anterior fica (sem piscar)
  const visivel = estado.fase === 'pronto' ? estado : estado.fase === 'buscando' ? ultimos : null;
  const trechos = visivel?.trechos ?? [];
  const emProducao = visivel?.emProducao ?? [];
  const aberto = trechos.length > 0;
  const nadaAchado = estado.fase === 'pronto' && trechos.length === 0 && emProducao.length === 0;
  const palavraPelaMetade = consulta.length > 0 && consulta.length < CONSULTA_COMPLETA;

  function limpar() {
    setTexto('');
    campo.current?.focus();
  }

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape' && texto) {
      e.preventDefault();
      limpar();
      return;
    }
    if (!aberto) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAtivo((i) => (i + 1) % trechos.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAtivo((i) => (i - 1 + trechos.length) % trechos.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      router.push(trechos[Math.min(ativo, trechos.length - 1)].url);
    }
  }

  const contextoSuporte = `Procurei "${consulta}" na Universidade Homio e não achei o que resolve.`;

  let anuncio = '';
  if (estado.fase === 'buscando') anuncio = 'Buscando.';
  else if (estado.fase === 'pronto') {
    if (trechos.length > 0) {
      anuncio = `${trechos.length} ${trechos.length === 1 ? 'trecho encontrado' : 'trechos encontrados'}.`;
    } else if (emProducao.length > 0) {
      anuncio = 'O vídeo desse assunto está em produção. Há um texto que cobre.';
    } else if (!palavraPelaMetade) {
      anuncio = 'Não achei um tutorial com essas palavras.';
    }
  }

  return (
    <section aria-label="Buscar pelo problema" className="not-prose mb-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fd-muted-foreground"
          aria-hidden
        />
        <label htmlFor={`${id}-campo`} className="sr-only">
          O que deu errado? Escreva o problema com as suas palavras
        </label>
        <input
          ref={campo}
          id={`${id}-campo`}
          type="search"
          role="combobox"
          aria-expanded={aberto}
          aria-controls={idLista}
          aria-autocomplete="list"
          aria-activedescendant={aberto ? `${id}-opcao-${ativo}` : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={CONSULTA_MAXIMA}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={aoTeclar}
          placeholder="O que deu errado?"
          className="h-14 w-full rounded-xl border border-fd-border bg-fd-card pl-12 pr-12 text-base text-fd-foreground caret-fd-primary transition-[border-color] placeholder:text-fd-muted-foreground hover:border-fd-foreground/30 focus:border-fd-primary focus:outline-2 focus:outline-offset-2 focus:outline-fd-ring dark:bg-fd-secondary/40 [&::-webkit-search-cancel-button]:hidden"
        />
        <span className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center">
          {estado.fase === 'buscando' ? (
            <Loader2
              className="size-4 animate-spin text-fd-muted-foreground motion-reduce:animate-none"
              aria-hidden
            />
          ) : texto ? (
            <button
              type="button"
              onClick={limpar}
              aria-label="Limpar a busca"
              className="inline-flex size-11 items-center justify-center rounded-lg text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fd-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </span>
      </div>

      <p role="status" className="sr-only">
        {anuncio}
      </p>

      {!consulta && exemplos.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-fd-muted-foreground">
          <span>Escreva do seu jeito. Por exemplo:</span>
          {exemplos.map((exemplo) => (
            <button
              key={exemplo}
              type="button"
              onClick={() => {
                setTexto(exemplo);
                campo.current?.focus();
              }}
              className="inline-flex min-h-11 items-center rounded-lg border border-fd-border bg-fd-background px-3 text-sm text-fd-foreground transition-colors hover:border-fd-primary/50 hover:bg-fd-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring sm:min-h-8"
            >
              {exemplo}
            </button>
          ))}
        </div>
      ) : null}

      {palavraPelaMetade && !aberto && estado.fase !== 'erro' ? (
        <p className="mt-3 text-sm text-fd-muted-foreground">
          Continue escrevendo: uma ou duas palavras do problema já bastam.
        </p>
      ) : null}

      {/* antes da lista: quem procurou esse assunto precisa ler isso primeiro */}
      {emProducao.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-2">
          {emProducao.map((item) => (
            <li
              key={item.titulo}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-dashed border-fd-border px-3 py-2 sm:px-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fd-muted text-fd-muted-foreground">
                <Clapperboard className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 basis-56">
                <span className="block text-[15px] font-medium leading-snug text-fd-foreground">
                  {item.titulo}
                </span>
                <span className="mt-0.5 block text-xs text-fd-foreground/70">
                  {item.tema} · o vídeo está em produção
                </span>
              </span>
              {item.doc ? (
                <Link href={item.doc} className={`${LINK_EM_LINHA} gap-1 text-sm`}>
                  Ler em texto
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : null}

            </li>
          ))}
        </ul>
      ) : null}

      <div
        id={idLista}
        role="listbox"
        aria-label="Trechos que resolvem"
        aria-busy={estado.fase === 'buscando'}
        hidden={!aberto}
      >
        {aberto ? (
          <ul role="presentation" className="mt-2 overflow-hidden rounded-xl border border-fd-border bg-fd-card dark:bg-fd-secondary/40">
            {trechos.map((trecho, i) => {
              const selecionado = i === ativo;
              return (
                <li
                  key={trecho.url}
                  role="presentation"
                  data-selecionado={selecionado || undefined}
                  className="flex items-center border-b border-fd-border transition-colors last:border-b-0 data-[selecionado]:bg-fd-primary/8"
                >
                  <Link
                    id={`${id}-opcao-${i}`}
                    role="option"
                    aria-selected={selecionado}
                    tabIndex={-1}
                    href={trecho.url}
                    onMouseEnter={() => setAtivo(i)}
                    className="group flex min-w-0 flex-1 items-center gap-3 px-3 py-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fd-ring sm:px-4"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fd-primary/10 text-fd-primary">
                      {trecho.video ? (
                        <Play className="ml-px size-4" fill="currentColor" aria-hidden />
                      ) : (
                        <FileText className="size-4" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-medium leading-snug text-fd-foreground">
                        {trecho.pergunta}
                      </span>
                      <span className="mt-0.5 flex text-xs text-fd-foreground/70">
                        <span className="truncate">
                          <span className="hidden sm:inline">{trecho.tema} · </span>
                          {trecho.tutorial}
                        </span>
                        <span className="shrink-0 whitespace-pre tabular-nums">
                          {trecho.video ? ` · ${duracao(trecho.duracao_s)}` : ' · resposta em texto'}
                        </span>
                      </span>
                    </span>
                    {suporte ? null : (
                      <ArrowRight
                        className="size-4 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-aria-selected:opacity-100"
                        aria-hidden
                      />
                    )}
                  </Link>
                  {suporte && trecho.link && trecho.resposta ? (
                    <span className="flex shrink-0 items-center gap-1.5 pr-3 sm:pr-4">
                      <CopiarLink url={trecho.link} descricao={trecho.titulo} compacto />
                      <CopiarResposta texto={trecho.resposta} descricao={trecho.titulo} compacto />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {aberto || emProducao.length > 0 ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-fd-muted-foreground sm:mt-2">
          Não é isso?
          <SupportDialog rotulo="Falar com o suporte" contexto={contextoSuporte} className={LINK_EM_LINHA} />
        </p>
      ) : null}

      {nadaAchado && !palavraPelaMetade ? (
        <div className="mt-2 rounded-xl border border-dashed border-fd-border px-4 py-4">
          <p className="text-[15px] font-medium text-fd-foreground">
            Não achei um tutorial com essas palavras.
          </p>
          <p className="mt-1 max-w-[64ch] text-sm text-fd-muted-foreground">
            Tente dizer de outro jeito, procure na documentação em texto ou conte para o suporte o
            que aconteceu.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setOpenSearch(true)} className={ACAO_SECUNDARIA}>
              <Search className="size-4" aria-hidden />
              Procurar na documentação
            </button>
            <SupportDialog
              rotulo="Falar com o suporte"
              contexto={contextoSuporte}
              className={ACAO_SECUNDARIA}
            />
          </div>
        </div>
      ) : null}

      {estado.fase === 'erro' ? (
        <p role="alert" className="mt-2 text-sm text-fd-muted-foreground">
          A busca não respondeu. Confira a conexão e escreva de novo, ou escolha o módulo logo
          abaixo.
        </p>
      ) : null}
    </section>
  );
}
