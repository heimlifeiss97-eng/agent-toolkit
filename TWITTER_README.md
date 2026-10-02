# Twitter/X Agent Toolkit

The Twitter/X Agent Toolkit enables AI agents to handle Twitter notifications and direct messages. It integrates with popular frameworks like OpenAI SDK, LangChain, Vercel AI SDK, AWS Bedrock, and Model Context Protocol (MCP).

## Features

- **Notifications Management**
  - List user notifications
  - Search notifications with filters
  - Get detailed notification information
  - Mark notifications as read (requires elevated API access)

- **Direct Messages Handling**
  - List direct message conversations
  - Get specific conversation history
  - Send direct messages to users
  - Search through direct messages

## Installation

```bash
npm install @paypal/agent-toolkit
```

## Authentication

You'll need a Twitter API v2 ******

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create or select an application
3. Navigate to "Keys and Tokens"
4. Copy your ******
5. Set it as the `TWITTER_BEARER_TOKEN` environment variable

## Usage with AI SDK

```typescript
import { TwitterAgentToolkit } from '@paypal/agent-toolkit/twitter/ai-sdk';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const toolkit = new TwitterAgentToolkit({
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
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
const tools = toolkit.getTools();

const response = await generateText({
  model,
  tools,
  maxSteps: 10,
  prompt: 'Check my latest Twitter notifications and list my recent DMs',
});

console.log(response.text);
```

## Usage with LangChain

```typescript
import { TwitterLangChainToolkit } from '@paypal/agent-toolkit/twitter/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { pull } from 'langchain/hub';

const toolkit = new TwitterLangChainToolkit({
  bearerToken: process.env.TWITTER_BEARER_TOKEN,
  configuration: {
    actions: {
      notifications: {
        list: true,
      },
      directMessages: {
        list: true,
        send: true,
      },
    },
  },
});

const tools = toolkit.getTools();
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
  input: 'What are my latest notifications?',
});

console.log(result);
```

## Available Tools

### Notifications

- **list_notifications**: Fetch the user's notifications with optional filters
  - Parameters: `limit` (1-100), `expand_details` (boolean)

- **search_notifications**: Search through notifications with keywords and filters
  - Parameters: `query` (string), `limit` (1-100), `notification_type` (optional)

- **get_notification_details**: Get detailed information about a specific notification
  - Parameters: `notification_id` (string)

- **mark_notifications_as_read**: Mark notifications as read (requires Premium API)
  - Parameters: `notification_ids` (array of strings)

### Direct Messages

- **list_direct_messages**: List DM conversations for the authenticated user
  - Parameters: `limit` (1-100), `pagination_token` (optional)

- **get_direct_message_conversation**: Retrieve a specific DM conversation with full history
  - Parameters: `conversation_id`, `limit` (1-100), `pagination_token` (optional)

- **send_direct_message**: Send a direct message to another user
  - Parameters: `recipient_id`, `message`, `reply_to_message_id` (optional)

- **search_direct_messages**: Search through direct messages
  - Parameters: `query` (string), `limit` (1-100), `conversation_with` (optional)

## Configuration

The toolkit supports flexible configuration:

```typescript
const configuration = {
  actions: {
    notifications: {
      list: true,      // Enable listing notifications
      markAsRead: true, // Enable marking as read
      search: true,    // Enable searching notifications
    },
    directMessages: {
      list: true,      // Enable listing DMs
      get: true,       // Enable getting DM conversations
      send: true,      // Enable sending DMs
      search: true,    // Enable searching DMs
    },
  },
  context: {
    userId: 'your_user_id', // Optional: your Twitter user ID
    maxResults: 50,         // Optional: default max results
  },
};
```

## API Limitations

- The free tier of Twitter API v2 has limitations on access to notifications
- Full access to notifications requires elevated access or Premium API tier
- DM functionality requires appropriate API permissions
- Rate limits apply based on your Twitter API tier

## Examples

See the `examples/` directory for complete working examples with:
- AI SDK + OpenAI
- LangChain + OpenAI
- OpenAI Functions
- AWS Bedrock
- Model Context Protocol (MCP)

## Supported Frameworks

- ✅ Vercel AI SDK
- ✅ LangChain
- ✅ OpenAI SDK
- ✅ AWS Bedrock
- ✅ Model Context Protocol (MCP)

## Error Handling

All toolkit methods return structured error responses:

```typescript
{
  error: {
    message: "Error description",
    type: "twitter_error"
  }
}
```

## Best Practices

1. **Rate Limiting**: Implement appropriate delays between API calls
2. **Error Handling**: Always handle error responses from the toolkit
3. **Token Refresh**: Keep your ****** secure and refresh when needed
4. **Scope**: Only enable the tools/actions you need
5. **Pagination**: Use pagination tokens for large result sets

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- GitHub Issues: Report bugs or feature requests
- Twitter Developer Support: For API-related questions
