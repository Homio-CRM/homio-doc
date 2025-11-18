# Changelog - Módulo de IA (Liv)

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

