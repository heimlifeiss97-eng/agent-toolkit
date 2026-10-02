import { TwitterLangChainToolkit } from '@paypal/agent-toolkit/twitter/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';

async function main() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    throw new Error('TWITTER_BEARER_TOKEN environment variable is required');
  }

  const twitterToolkit = new TwitterLangChainToolkit({
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

  const tools = twitterToolkit.getTools();
  const model = new ChatOpenAI({ temperature: 0 });
  const prompt = await pull('hwchase17/openai-functions-agent');

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const result = await agentExecutor.invoke({
    input: `Check my latest Twitter notifications and tell me about any new mentions. Then list my recent direct messages.`,
  });

  console.log('Result:', result);
}

main().catch(console.error);
