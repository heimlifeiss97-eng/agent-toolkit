import { Tool } from 'ai';
import { z } from 'zod';
import TwitterAPI from '../shared/api';

const TwitterTool = (
  twitterAPI: TwitterAPI,
  method: string,
  description: string,
  parameters: z.ZodObject<any, any, any, any>
): Tool<any, any> =>
  ({
    description,
    parameters,
    execute: async (args: any) => {
      return await twitterAPI.run(method, args);
    },
  } as Tool<any, any>);

export default TwitterTool;
