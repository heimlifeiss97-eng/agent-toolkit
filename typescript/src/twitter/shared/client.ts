import axios, { AxiosInstance } from 'axios';
import type { Context } from './configuration';

class TwitterClient {
  private accessToken: string;
  private axiosInstance: AxiosInstance;
  private baseUrl: string = 'https://api.twitter.com/2';

  constructor({ bearerToken, context }: { bearerToken: string; context?: Context }) {
    this.accessToken = bearerToken;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: 'Bearer ' + bearerToken,
        'User-Agent': 'TwitterAgentToolkit/1.0',
      },
    });
  }

  async get(path: string, params?: any): Promise<any> {
    try {
      const response = await this.axiosInstance.get(path, { params });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post(path: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.post(path, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put(path: string, data: any): Promise<any> {
    try {
      const response = await this.axiosInstance.put(path, data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete(path: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(path);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.errors) {
      const errorMsg = error.response.data.errors.map((e: any) => e.message).join(', ');
      return new Error(`Twitter API Error: ${errorMsg}`);
    }
    return error;
  }
}

export default TwitterClient;
