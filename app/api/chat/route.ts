import { streamText, convertToModelMessages } from 'ai'

export async function POST(req: Request) {
  const { messages, context } = await req.json()

  const systemPrompt = `You are a coding assistant integrated into ShadowSandBox, a cloud-based IDE.
You help developers write, debug, and understand code.

${context ? `Current file context:\n\`\`\`\n${context}\n\`\`\`\n` : ''}

Guidelines:
- Provide concise, helpful code suggestions
- When showing code, use appropriate markdown code blocks
- Explain complex concepts briefly
- Focus on the specific programming language or framework being used
- If asked to write code, provide complete, working examples
- For debugging, identify the issue and suggest fixes`

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
