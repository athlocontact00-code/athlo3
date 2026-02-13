import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider, isAIAvailable } from '@/lib/ai/provider';
import { AIContextBuilder, createMockContext } from '@/lib/ai/context';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, threadId, includeContext = true } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if AI is available
    if (!isAIAvailable()) {
      return NextResponse.json({
        content: "I'm currently in demo mode. Please configure your OpenAI API key to enable full AI coaching capabilities. In the meantime, I can provide general training advice based on common patterns.",
        suggestions: [
          "Tell me about your training goals",
          "How has your training been lately?",
          "What sport are you training for?",
        ],
        metadata: { demo: true },
      });
    }

    const provider = getAIProvider();

    // Build context if requested
    let context = '';
    if (includeContext) {
      // In a real app, this would come from the database based on the user session
      const contextBuilder = createMockContext();
      context = contextBuilder.buildContext();
    }

    // Create messages array
    const messages = [
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      }
    ];

    // Get AI response
    const response = await provider.chat(messages, context, threadId || undefined);

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Coach API error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

// Streaming endpoint
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const message = searchParams.get('message');
  const threadId = searchParams.get('threadId');
  const includeContext = searchParams.get('includeContext') === 'true';

  if (!message) {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    );
  }

  // Check if AI is available
  if (!isAIAvailable()) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const response = {
          content: "I'm currently in demo mode. Please configure your OpenAI API key to enable full AI coaching capabilities.",
          isComplete: true,
          suggestions: [
            "Tell me about your training goals",
            "How has your training been lately?",
            "What sport are you training for?",
          ],
          metadata: { demo: true },
        };
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(response)}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  try {
    const provider = getAIProvider();

    // Build context if requested
    let context = '';
    if (includeContext) {
      const contextBuilder = createMockContext();
      context = contextBuilder.buildContext();
    }

    // Create messages array
    const messages = [
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date(),
      }
    ];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of provider.chatStream(messages, context, threadId || undefined)) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
            
            if (chunk.isComplete) {
              break;
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          const errorResponse = {
            content: 'Sorry, I encountered an error. Please try again.',
            isComplete: true,
            error: true,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorResponse)}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI Coach streaming error:', error);
    return NextResponse.json(
      { error: 'Failed to process streaming request' },
      { status: 500 }
    );
  }
}