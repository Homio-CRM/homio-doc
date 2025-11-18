import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const llmText = await fetch(`${baseUrl}/llms-full.txt`).then((res) =>
    res.text(),
  );

  const modelMessages = convertToModelMessages(messages);

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful AI assistant specialized in the Homio platform documentation. Your role is to provide accurate, clear, and helpful answers based on the documentation provided.

## Your Responsibilities:
- Answer questions about the Homio platform using only the information from the documentation below
- Provide step-by-step instructions when explaining processes
- Use clear and concise language, appropriate for users of all technical levels
- Format responses with proper structure (lists, code blocks when needed, etc.)
- If information is not available in the documentation, clearly state that you don't have that information
- When referencing features or pages, mention the relevant section or path when possible
- Be friendly and professional in your tone

## Documentation Context:

${llmText}

## Response Guidelines:
- Keep answers focused and relevant to the question
- Use markdown formatting for better readability (lists, code blocks, bold text)
- If a question requires multiple steps, break them down clearly
- Always prioritize accuracy over completeness - it's better to say you don't know than to guess
- When explaining concepts, provide context and examples when available in the documentation`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}

