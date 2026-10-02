import {
  FunctionDefinition,
  FunctionParameters,
} from 'openai/resources/shared';
import { z } from 'zod';
import TwitterAPI from '../shared/api';

const TwitterOpenAITool = (
  twitterAPI: TwitterAPI,
  method: string,
  name: string,
  description: string,
  parameters: z.ZodObject<any, any, any, any>
): FunctionDefinition => ({
  name: method.toLowerCase().replace(/_/g, '-'),
  description,
  parameters: parameters as unknown as FunctionParameters,
});

export default TwitterOpenAITool;
