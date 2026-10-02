import {
  listNotifications,
  markNotificationsAsRead,
  searchNotifications,
  listDirectMessages,
  getDirectMessageConversation,
  sendDirectMessage,
  searchDirectMessages,
  getNotificationDetails,
} from './functions';

import type { Context } from './configuration';
import TwitterClient from './client';

class TwitterAPI {
  twitterClient: TwitterClient;
  context: Context;

  constructor(
    twitterClientOrBearerToken: TwitterClient | string,
    context?: Context
  ) {
    this.context = context || {};

    if (typeof twitterClientOrBearerToken === 'string') {
      this.twitterClient = new TwitterClient({
        bearerToken: twitterClientOrBearerToken,
        context: this.context,
      });
    } else {
      this.twitterClient = twitterClientOrBearerToken;
    }
  }

  async run(method: string, arg: any): Promise<string> {
    try {
      const output = await this.executeMethod(method, arg);
      return JSON.stringify(output);
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      return JSON.stringify({
        error: {
          message: errorMessage,
          type: 'twitter_error',
        },
      });
    }
  }

  private async executeMethod(method: string, arg: any): Promise<any> {
    switch (method) {
      case 'list_notifications':
        return await listNotifications(this.twitterClient, this.context, arg);
      case 'mark_notifications_as_read':
        return await markNotificationsAsRead(this.twitterClient, this.context, arg);
      case 'search_notifications':
        return await searchNotifications(this.twitterClient, this.context, arg);
      case 'list_direct_messages':
        return await listDirectMessages(this.twitterClient, this.context, arg);
      case 'get_direct_message_conversation':
        return await getDirectMessageConversation(this.twitterClient, this.context, arg);
      case 'send_direct_message':
        return await sendDirectMessage(this.twitterClient, this.context, arg);
      case 'search_direct_messages':
        return await searchDirectMessages(this.twitterClient, this.context, arg);
      case 'get_notification_details':
        return await getNotificationDetails(this.twitterClient, this.context, arg);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}

export default TwitterAPI;
