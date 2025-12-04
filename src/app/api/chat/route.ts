import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { getLLMText, source } from '@/lib/source';

export const runtime = 'nodejs';

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    let llmText = '';
    try {
      const pages = source.getPages();
      const scan = pages.map(getLLMText);
      const scanned = await Promise.all(scan);
      llmText = scanned.join('\n\n');
    } catch (sourceError) {
      console.error('Error loading source pages:', sourceError);
      llmText = 'Documentação não disponível no momento.';
    }

    const normalizedMessages = messages.map((msg: any) => {
      if (msg.parts) {
        return msg;
      }
      if (msg.content) {
        return {
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          role: msg.role,
          parts: [{ type: 'text' as const, text: msg.content }],
        };
      }
      if (msg.text) {
        return {
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          role: msg.role,
          parts: [{ type: 'text' as const, text: msg.text }],
        };
      }
      return msg;
    });

    const modelMessages = convertToModelMessages(normalizedMessages);

    const result = await streamText({
      model: openai('gpt-5.1'),
      providerOptions: {
        openai: {
          serviceTier: 'flex',
        },
      },
      system: `Você é um assistente de IA especializado na documentação da plataforma Homio. Seu papel é fornecer respostas precisas, claras e úteis com base na documentação fornecida.

## Suas Responsabilidades:
- Responder perguntas sobre a plataforma Homio usando apenas as informações da documentação abaixo
- Fornecer instruções passo a passo ao explicar processos
- Usar linguagem clara e concisa, apropriada para usuários de todos os níveis técnicos
- Formatar respostas com estrutura adequada (listas, blocos de código quando necessário, etc.)
- Se a informação não estiver disponível na documentação, declare claramente que você não possui essa informação
- Ao referenciar funcionalidades ou páginas, mencione a seção ou caminho relevante quando possível
- Ser amigável e profissional no tom
- Sempre incluir fontes numeradas no final da resposta quando citar informações da documentação

## Contexto da Documentação:

${llmText}

## Diretrizes de Resposta:
- Manter respostas focadas e relevantes à pergunta
- Usar formatação markdown para melhor legibilidade (listas, blocos de código, texto em negrito)
- Se uma pergunta exigir múltiplas etapas, divida-as claramente
- Sempre priorizar precisão sobre completude - é melhor dizer que não sabe do que adivinhar
- Ao explicar conceitos, fornecer contexto e exemplos quando disponíveis na documentação
- Ao final da linha de resposta, incluir a fonte da informação no formato (1), (2), (3), etc.
- Cada fonte deve incluir o link para a página da documentação citada no formato markdown: (1) [Título da Página](caminho/da/pagina)
- Use os links que aparecem no formato (caminho) da documentação fornecida acima
- Foque em responder apenas a pergunta do usuário, não adicione informações que não foram solicitadas.
- Se você citar informações de múltiplas páginas, liste todas as fontes numeradas`,
      messages: modelMessages,
    });

    const response = result.toUIMessageStreamResponse();
    
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Content-Type', response.headers.get('Content-Type') || 'text/plain; charset=utf-8');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const errorResponse = new Response(
      JSON.stringify({ 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {})
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
    return errorResponse;
  }
}

