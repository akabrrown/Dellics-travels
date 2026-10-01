import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import * as crypto from 'node:crypto';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Exchange RouteStack keys for a partner token
  const BASE_URL = process.env.ROUTESTACK_MCP_URL || 'https://mcp.routestack.ai';
  const API_KEY = process.env.ROUTESTACK_API_KEY || '';
  const API_SECRET = process.env.ROUTESTACK_API_SECRET || '';
  
  let routeStackToken = '';
  
  if (API_KEY && API_SECRET) {
    try {
      const ts = Math.floor(Date.now() / 1000);
      const nonce = crypto.randomUUID();
      const hmac = crypto.createHmac('sha256', API_SECRET)
        .update(`${API_KEY}:${ts}:${nonce}`)
        .digest('base64url');

      const authRes = await fetch(`${BASE_URL}/mcp/auth/partner-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: API_KEY, hmac, timestamp: ts, nonce }),
      });
      
      const authData = await authRes.json();
      if (authData.token) {
        routeStackToken = authData.token;
      }
    } catch (e) {
      console.error('Failed to authenticate with RouteStack:', e);
    }
  }

  // Ensure OpenAI key is present
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file to use the AI Agent.' 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are Dellics Travels AI Agent, powered by RouteStack. You can help users book flights, hotels, and cars. Be concise, polite, and helpful.',
    messages,
    tools: {
      searchHotels: tool({
        description: 'Search for hotels in a specific city on specific dates',
        parameters: z.object({
          city: z.string().describe('The city to search for hotels in'),
          checkIn: z.string().describe('Check-in date in YYYY-MM-DD format'),
          checkOut: z.string().describe('Check-out date in YYYY-MM-DD format'),
        }),
        execute: async ({ city, checkIn, checkOut }: { city: string; checkIn: string; checkOut: string }) => {
          if (!routeStackToken) {
            return { error: 'RouteStack authentication failed or keys are missing.' };
          }
          
          try {
            const res = await fetch(`${BASE_URL}/mcp/hotel/search-hotels`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${routeStackToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ city, checkIn, checkOut }),
            });
            
            if (!res.ok) {
              return { error: `API returned ${res.status}` };
            }
            
            return await res.json();
          } catch (e) {
            return { error: 'Failed to fetch hotels from RouteStack API' };
          }
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
