import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { TwitterAgentToolkit } from '@paypal/agent-toolkit/twitter/ai-sdk';

async function main() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    throw new Error('TWITTER_BEARER_TOKEN environment variable is required');
  }

  const twitterToolkit = new TwitterAgentToolkit({
    bearerToken: bearerToken,
    configuration: {
      actions: {
        notifications: {
          list: true,
          search: true,
        },
        directMessages: {
          list: true,
          send: true,
        },
      },
    },
  });

  const model = openai('gpt-4');
  const tools = twitterToolkit.getTools();

  const response = await generateText({
    model,
    tools: tools as any,
    maxSteps: 10,
    prompt: `Check my latest Twitter notifications and summarize them. Then send a direct message to user 12345 saying "Hello! Thanks for your interest!"`,
  });

  console.log('Response:', response.text);
}

main().catch(console.error);
