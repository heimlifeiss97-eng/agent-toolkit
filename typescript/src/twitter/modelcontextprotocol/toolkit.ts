import TwitterClient from '../shared/client';
import TwitterAPI from '../shared/api';
import { Configuration, isToolAllowed } from '../shared/configuration';
import tools from '../shared/tools';

const SOURCE = 'MCP';

class TwitterMCPToolkit {
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
      name: item.method.toLowerCase().replace(/_/g, '-'),
      description: item.description,
      inputSchema: {
        type: 'object',
        properties: item.parameters.shape,
        required: Object.keys(item.parameters.shape).filter(
          (key) => !item.parameters.shape[key].isOptional?.()
        ),
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

export default TwitterMCPToolkit;
