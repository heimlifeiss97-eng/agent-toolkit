import { Tool as LangChainTool } from '@langchain/core/tools';
import { z } from 'zod';
import TwitterAPI from '../shared/api';

const TwitterLangChainTool = (
  twitterAPI: TwitterAPI,
  method: string,
  name: string,
  description: string,
  parameters: z.ZodObject<any, any, any, any>
): LangChainTool =>
  new LangChainTool({
    name: method.toLowerCase().replace(/_/g, '-'),
    description,
    schema: parameters,
    func: async (input: any) => {
      return await twitterAPI.run(method, input);
    },
  });

export default TwitterLangChainTool;
