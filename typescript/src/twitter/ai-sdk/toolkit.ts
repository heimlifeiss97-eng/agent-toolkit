import { Tool } from 'ai';
import TwitterAPI from '../shared/api';
import TwitterClient from '../shared/client';
import { Configuration, isToolAllowed } from '../shared/configuration';
import tools from '../shared/tools';
import TwitterTool from './tools';

const SOURCE = 'AI-SDK';

class TwitterAgentToolkit {
  readonly client: TwitterClient;
  private _twitter: TwitterAPI;
  private _tools: { [key: string]: Tool };

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
    this._tools = filteredTools.reduce((acc, item) => {
      acc[item.method] = TwitterTool(this._twitter, item.method, item.description, item.parameters);
      return acc;
    }, {} as { [key: string]: Tool });
  }

  getTools(): { [key: string]: Tool } {
    return this._tools;
  }
}

export default TwitterAgentToolkit;
