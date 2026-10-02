import TwitterClient from '../shared/client';
import TwitterAPI from '../shared/api';
import { Configuration, isToolAllowed } from '../shared/configuration';
import tools from '../shared/tools';
import TwitterLangChainTool from './tool';

const SOURCE = 'LANGCHAIN';

class TwitterLangChainToolkit {
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
    this._tools = filteredTools.map((item) =>
      TwitterLangChainTool(
        this._twitter,
        item.method,
        item.name,
        item.description,
        item.parameters
      )
    );
  }

  getTools(): any[] {
    return this._tools;
  }
}

export default TwitterLangChainToolkit;
