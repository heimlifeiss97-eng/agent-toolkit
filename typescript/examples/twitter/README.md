# Twitter Agent Toolkit Examples

These examples demonstrate how to use the Twitter Agent Toolkit with different AI frameworks.

## AI SDK Example

The AI SDK example shows how to use the Twitter Agent Toolkit with OpenAI:

```bash
cd typescript/examples/twitter-ai-sdk
npm install
TWITTER_BEARER_TOKEN=your_token npm start
```

## LangChain Example

The LangChain example demonstrates integration with LangChain agents:

```bash
cd typescript/examples/twitter-langchain
npm install
TWITTER_BEARER_TOKEN=your_token npm start
```

## Getting Your Twitter ******

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create an application or select an existing one
3. Go to Keys and Tokens
4. Copy your ******
5. Set it as the `TWITTER_BEARER_TOKEN` environment variable

## Features Demonstrated

- **List Notifications**: Fetch and display user notifications
- **Search Notifications**: Search through notifications with filters
- **List Direct Messages**: View DM conversations
- **Send Direct Messages**: Send new messages to users
- **Get DM Conversations**: Retrieve full DM conversation history
