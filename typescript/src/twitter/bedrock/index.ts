import TwitterClient from '../shared/client';
import TwitterAPI from '../shared/api';
import { Configuration, isToolAllowed } from '../shared/configuration';
import tools from '../shared/tools';

const SOURCE = 'BEDROCK';

class TwitterBedrockToolkit {
  readonly client: TwitterClient;
  private _twitter: TwitterAPI;
  private _tools: any[];

  constructor({
    bearerToken,
    configuration,
  }: {
    bearerToken: string;
    configuration: Configuration;
  }) {
    const context = configuration.context || {};
    this.client = new TwitterClient({
      bearerToken: bearerToken,
      context: { ...context, source: SOURCE },
    });
    const filteredTools = tools(context).filter((tool) =>
      isToolAllowed(tool, configuration)
    );
    this._twitter = new TwitterAPI(this.client, configuration.context);
    this._tools = filteredTools.map((item) => ({
      toolSpec: {
        name: item.method.toLowerCase().replace(/_/g, '-'),
        description: item.description,
        inputSchema: {
          json: item.parameters,
        },
      },
      executeToolFunction: async (params: Record<string, any>) => {
        return await this._twitter.run(item.method, params);
      },
    }));
  }

  getTools() {
    return this._tools;
  }

  async executeMethod(method: string, params: Record<string, any>): Promise<string> {
    return await this._twitter.run(method, params);
  }
}

export default TwitterBedrockToolkit;
