# Changelog - Módulo de IA (Liv)

---

## [19/11/2025] - Correção de Formatação de Listas no Markdown

### Problema Identificado
As listas numeradas e com marcadores no chat da IA apresentavam espaços indesejados entre o número/marcador e o texto, causando uma formatação visual inadequada.

### Causa
O ReactMarkdown adiciona automaticamente tags `<p>` dentro dos itens de lista (`<li>`), e essas tags possuíam margens verticais (`my-2`) que criavam espaços extras.

### Solução Implementada
1. **Listas `<ol>` e `<ul>`:**
   - Adicionado `[&_p]:my-0` para remover margens de parágrafos dentro das listas
   
2. **Itens de lista `<li>`:**
   - Adicionado `[&>p]:inline` para tornar parágrafos filhos diretos inline
   - Previne quebras de linha indesejadas entre número/marcador e texto

3. **Parágrafos normais:**
   - Adicionado `first:mt-0 last:mb-0` para remover margens dos primeiro e último parágrafos

4. **Espaçamento:**
   - Reduzido `space-y-1.5` para `space-y-1` para listas mais compactas

### Arquivo Modificado
- `src/components/search.tsx` - Linhas 168-170

### Resultado
Listas numeradas e com marcadores agora são exibidas corretamente, com número/marcador seguido diretamente pelo texto, sem espaços extras.

---

## [19/11/2025] - Melhorias de Responsividade e UX

### Descrição
Implementadas melhorias significativas de responsividade e experiência do usuário no módulo de IA, garantindo funcionamento adequado em todos os tamanhos de tela.

### Mudanças Realizadas

#### 1. Remoção da Animação de "Pulsar" do Botão
- Removida classe `animate-pulse` do botão flutuante
- Botão agora permanece estável, apenas com animação suave no hover
- Melhora a percepção visual e reduz distração

#### 2. Responsividade do Botão Flutuante
**Mobile:**
- Tamanho: 48px × 48px (reduzido)
- Posição: `bottom-4 right-4`
- Ícone: 20px × 20px

**Desktop:**
- Tamanho: 56px × 56px
- Posição: `bottom-6 right-6`
- Ícone: 24px × 24px

#### 3. Responsividade do Popover (Janela do Chat)

**Largura:**
- Mobile: `calc(100vw - 1.5rem)` - mais estreito para melhor visualização
- Small screens (≥640px): 400px
- Medium screens (≥768px): 480px

**Altura:**
- Mobile: `calc(100vh - 6rem)` - **garante que não ultrapasse a viewport**
- Small screens: 600px (máximo)
- Solução para o problema de chat saindo para cima da tela

**Offset:**
- Reduzido de 12px para 8px para melhor posicionamento

#### 4. Otimização de Espaçamentos Internos

**Cabeçalho:**
- Mobile: `px-4 pt-4 pb-3`
- Desktop: `px-6 pt-6 pb-4`
- Ícone e indicador de status com tamanhos responsivos
- Textos com `truncate` para evitar overflow

**Área de Mensagens:**
- Mobile: `px-4 py-3`
- Desktop: `px-6 py-4`
- `space-y-3` em mobile, `space-y-4` em desktop
- Altura mínima reduzida para 180px

**Estado Vazio (Boas-vindas):**
- Ícone: 48px em mobile, 64px em desktop
- Padding reduzido em mobile: `py-4`
- Textos com tamanhos responsivos: `text-[11px] sm:text-xs`

**Botões de Perguntas Sugeridas:**
- Padding: `px-3 py-2.5` em mobile, `px-4 py-3` em desktop
- Texto: `text-xs` em mobile, `text-sm` em desktop
- Ícones: 12px em mobile, 14px em desktop

**Rodapé (Formulário):**
- Mobile: `px-4 pb-4 pt-3`
- Desktop: `px-6 pb-6 pt-4`
- Input e botão com tamanhos responsivos
- Botão "Enviar" com `shrink-0` para não encolher demais

### Arquivos Modificados
- `src/components/search.tsx` - Linhas 74-243

### Resultado
- Chat totalmente responsivo e funcional em todos os tamanhos de tela
- Não ultrapassa mais os limites da viewport
- Espaçamentos otimizados para melhor aproveitamento do espaço
- Experiência consistente entre mobile e desktop

---

## [19/11/2025] - Melhorias de Design e UX do Chat

### Descrição
Implementado redesign completo do módulo de IA (Liv) com foco em melhor experiência visual e usabilidade.

### Melhorias Implementadas

#### 1. Botão Flutuante Aprimorado
- Gradiente vibrante: azul → roxo
- Ícone `Sparkles` (estrelinhas) ao invés de `MessageSquare`
- Animação de pulso para chamar atenção
- Efeito hover: scale e sombra colorida
- Rotação suave do ícone no hover

#### 2. Cabeçalho Modernizado
- Gradiente de fundo sutil (azul → roxo)
- Avatar circular com gradiente e ícone
- Indicador de status online (bolinha verde)
- Design mais clean e profissional

#### 3. Sistema de Perguntas Sugeridas
Implementado sistema de quick-start com 4 perguntas pré-definidas:
- "Como configurar notificações por email?"
- "Como criar um pipeline de vendas?"
- "Como usar campos personalizados?"
- "Como integrar WhatsApp?"

**Características:**
- Botões estilizados com ícone de estrela
- Hover effects (borda azul, sombra)
- Desabilitados durante carregamento
- Enviam pergunta automaticamente ao clicar

#### 4. Auto-Scroll Inteligente
- Scroll automático para última mensagem
- Ativado quando novas mensagens chegam
- Comportamento suave (`smooth`)
- Utiliza `useRef` e `useEffect` para controle

#### 5. Estilo de Mensagens Aprimorado
**Mensagens do Usuário:**
- Gradiente azul → roxo
- Cantos arredondados com destaque inferior direito (`rounded-br-sm`)
- Sombra suave com hover effect

**Mensagens da IA:**
- Fundo branco com borda azul claro
- Canto arredondado destaque inferior esquerdo (`rounded-bl-sm`)
- Suporte completo a Markdown (detalhado em outra entrada)

#### 6. Indicador de Carregamento
- Três bolinhas animadas (bounce)
- Cores alternadas (azul e roxo)
- Texto "Pensando..." 
- Animação de entrada suave

#### 7. Horários nas Mensagens
- Formato brasileiro (HH:MM)
- Texto pequeno e discreto
- Posicionado abaixo de cada mensagem

#### 8. Backdrop e Glassmorphism
- Efeito de vidro com `backdrop-blur-xl`
- Fundo branco semi-transparente (`bg-white/95`)
- Borda com gradiente azul claro
- Sombra pronunciada para profundidade

#### 9. Formulário de Entrada Melhorado
- Input com foco visual (anel azul)
- Botão gradiente com ícone de envio
- Texto "Enviar" visível apenas em telas maiores
- Estados de disabled bem definidos
- Animações de hover (scale, sombra)

### Animações CSS Customizadas
Adicionadas no `global.css`:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Arquivos Modificados
1. `src/components/search.tsx` - Redesign completo do componente
2. `src/app/global.css` - Adicionadas animações customizadas

### Resultado
Chat com aparência moderna, profissional e altamente interativo, mantendo consistência com o design system do Homio.

---

## [18/11/2025] - Correção do Scroll no Chat

### Problema Identificado
A área de mensagens do chat da IA não estava permitindo rolagem vertical, impossibilitando a visualização de conversas longas.

### Solução Implementada
- Removida a dependência do componente `ScrollArea` do fumadocs-ui
- Substituído por uma `div` nativa com `overflow-y-auto`
- Mantida a classe `flex-1` para ocupar o espaço disponível

### Arquivo Modificado
- `src/components/search.tsx` - Linha 65

### Resultado
O chat agora permite scroll suave vertical, possibilitando navegar por toda a conversa mesmo quando o conteúdo excede a altura disponível.

---

## [18/11/2025] - Suporte a Markdown no Módulo de IA

### Descrição
Implementado suporte completo para renderização de Markdown nas respostas do assistente de IA (Liv). As respostas agora exibem formatação adequada incluindo negritos, itálicos, listas, código, títulos e links.

## Mudanças Realizadas

### 1. Instalação de Dependência
- Adicionada a biblioteca `react-markdown` ao projeto para renderização de conteúdo Markdown

### 2. Atualização do Componente de Chat
**Arquivo:** `src/components/search.tsx`

#### Alterações:
- Importado `ReactMarkdown` do pacote `react-markdown`
- Modificada a renderização das mensagens do assistente para usar `ReactMarkdown` ao invés de texto simples
- Mantida a renderização de texto simples para mensagens do usuário (não requerem formatação)

#### Componentes Markdown Suportados:
- **Parágrafos** (`<p>`) - Com espaçamento adequado
- **Negrito** (`<strong>`) - Texto em negrito com fonte semibold
- **Itálico** (`<em>`) - Texto em itálico
- **Títulos** (`<h1>`, `<h2>`, `<h3>`) - Com tamanhos e espaçamentos apropriados
- **Listas não ordenadas** (`<ul>`) - Com marcadores de disco
- **Listas ordenadas** (`<ol>`) - Com numeração decimal
- **Itens de lista** (`<li>`) - Com espaçamento adequado
- **Código inline** (`<code>`) - Com fundo cinza claro e bordas arredondadas
- **Blocos de código** (`<pre>`) - Com fundo cinza, padding e scroll horizontal quando necessário
- **Citações** (`<blockquote>`) - Com borda lateral e estilo itálico
- **Links** (`<a>`) - Em azul com sublinhado, abrindo em nova aba

## Estilos Aplicados

Todos os elementos Markdown foram estilizados para manter consistência visual com o design do chat:
- Cores de texto em preto para melhor legibilidade
- Fundo cinza claro para elementos de código
- Espaçamento adequado entre elementos
- Links em azul com sublinhado
- Tamanhos de fonte apropriados para cada tipo de elemento

## Impacto

### Antes
- Respostas da IA eram exibidas como texto simples
- Formatação Markdown não era renderizada (aparecia como texto bruto)
- Dificuldade em ler respostas com listas, código ou formatação

### Depois
- Respostas da IA são renderizadas com formatação completa
- Negritos, itálicos, listas e código são exibidos corretamente
- Melhor experiência de leitura e compreensão das respostas

## Exemplo de Uso

O assistente agora pode retornar respostas formatadas como:

```markdown
## Como criar um dashboard

Para criar um dashboard no Homio:

1. Acesse a seção de **Dashboards**
2. Clique em **Novo Dashboard**
3. Configure as métricas desejadas

> **Dica:** Você pode personalizar os widgets conforme necessário.
```

E será renderizado com toda a formatação aplicada.

## Notas Técnicas

- A biblioteca `react-markdown` foi escolhida por ser leve e segura (não executa código JavaScript)
- Componentes customizados foram criados para manter controle total sobre os estilos
- Mensagens do usuário continuam sendo renderizadas como texto simples (não requerem formatação)
- Não foram necessárias alterações no backend ou na API de chat

## Arquivos Modificados

1. `package.json` - Adicionada dependência `react-markdown`
2. `src/components/search.tsx` - Implementada renderização Markdown

