import TwitterClient from './client';
import type { Context } from './configuration';

export async function listNotifications(
  client: TwitterClient,
  _context: Context,
  args: {
    limit?: number;
    expand_details?: boolean;
  }
): Promise<any> {
  try {
    const params: any = {
      max_results: args.limit || 25,
    };

    if (args.expand_details) {
      params.expansions = 'author_id,referenced_tweets.id';
      params.tweet_fields = 'created_at,author_id,public_metrics';
      params.user_fields = 'username,created_at';
    }

    // Using timeline endpoint (requires elevated access)
    const data = await client.get('/users/:id/reverse_chronological_timeline', params);
    return {
      notifications: data.data || [],
      includes: data.includes || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to list notifications: ${error.message}`);
  }
}

export async function markNotificationsAsRead(
  client: TwitterClient,
  _context: Context,
  args: {
    notification_ids: string[];
  }
): Promise<any> {
  try {
    // Note: Twitter API v2 doesn't have a direct "mark as read" endpoint for notifications
    // This would require a custom implementation or use of the newer Premium/Enterprise API
    return {
      success: true,
      message: 'Mark as read functionality would require Premium/Enterprise Twitter API access',
      marked_ids: args.notification_ids,
    };
  } catch (error: any) {
    throw new Error(`Failed to mark notifications as read: ${error.message}`);
  }
}

export async function searchNotifications(
  client: TwitterClient,
  _context: Context,
  args: {
    query: string;
    limit?: number;
    notification_type?: string;
  }
): Promise<any> {
  try {
    let searchQuery = args.query;

    if (args.notification_type) {
      // Filter by notification type using search operators
      const typeFilter: { [key: string]: string } = {
        like: 'is:liked',
        retweet: 'is:retweet',
        reply: 'in_reply_to_tweet_id:*',
        quote: 'is:quoted',
        follow: 'is:follow', // Would need special handling
        mention: '@',
      };
      searchQuery = `${searchQuery} ${typeFilter[args.notification_type] || ''}`;
    }

    const data = await client.get('/tweets/search/recent', {
      query: searchQuery,
      max_results: args.limit || 10,
      tweet_fields: 'created_at,author_id,public_metrics',
      expansions: 'author_id',
      user_fields: 'username',
    });

    return {
      notifications: data.data || [],
      includes: data.includes || {},
      meta: data.meta || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to search notifications: ${error.message}`);
  }
}

export async function listDirectMessages(
  client: TwitterClient,
  context: Context,
  args: {
    limit?: number;
    pagination_token?: string;
  }
): Promise<any> {
  try {
    if (!context.userId) {
      throw new Error('User ID is required. Set it in context configuration.');
    }

    const params: any = {
      max_results: args.limit || 50,
      dm_event_fields: 'created_at,sender_id,attachments,referenced_tweet_id',
      expansions: 'sender_id,attachments.media_key,referenced_tweet_id',
      user_fields: 'username,created_at',
      media_fields: 'public_metrics,preview_image_url',
    };

    if (args.pagination_token) {
      params.pagination_token = args.pagination_token;
    }

    const data = await client.get(`/dm_conversations/with/:participant_id/dm_events`, params);
    return {
      messages: data.data || [],
      includes: data.includes || {},
      meta: data.meta || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to list direct messages: ${error.message}`);
  }
}

export async function getDirectMessageConversation(
  client: TwitterClient,
  context: Context,
  args: {
    conversation_id: string;
    limit?: number;
    pagination_token?: string;
  }
): Promise<any> {
  try {
    const params: any = {
      max_results: args.limit || 50,
      dm_event_fields: 'created_at,sender_id,attachments,referenced_tweet_id',
      expansions: 'sender_id,attachments.media_key,referenced_tweet_id',
      user_fields: 'username,created_at',
      media_fields: 'public_metrics,preview_image_url',
    };

    if (args.pagination_token) {
      params.pagination_token = args.pagination_token;
    }

    const data = await client.get(`/dm_conversations/${args.conversation_id}/dm_events`, params);
    return {
      conversation_id: args.conversation_id,
      messages: data.data || [],
      includes: data.includes || {},
      meta: data.meta || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to get direct message conversation: ${error.message}`);
  }
}

export async function sendDirectMessage(
  client: TwitterClient,
  _context: Context,
  args: {
    recipient_id: string;
    message: string;
    reply_to_message_id?: string;
  }
): Promise<any> {
  try {
    const payload: any = {
      conversation_type: 'Direct Message',
      participant_ids: [args.recipient_id],
      message_data: {
        text: args.message,
      },
    };

    if (args.reply_to_message_id) {
      payload.message_data.reply_settings = {
        in_reply_to_dm_id: args.reply_to_message_id,
      };
    }

    const data = await client.post('/dm_conversations/with/:participant_id/messages', payload);
    return {
      success: true,
      message_id: data.data?.dm_conversation_id,
      recipient_id: args.recipient_id,
      message: args.message,
    };
  } catch (error: any) {
    throw new Error(`Failed to send direct message: ${error.message}`);
  }
}

export async function searchDirectMessages(
  client: TwitterClient,
  _context: Context,
  args: {
    query: string;
    limit?: number;
    conversation_with?: string;
  }
): Promise<any> {
  try {
    let searchQuery = args.query;

    if (args.conversation_with) {
      searchQuery = `${searchQuery} from:${args.conversation_with}`;
    }

    const data = await client.get('/tweets/search/recent', {
      query: searchQuery,
      max_results: args.limit || 10,
      dm_event_fields: 'created_at,sender_id',
      expansions: 'sender_id',
      user_fields: 'username',
    });

    return {
      messages: data.data || [],
      includes: data.includes || {},
      meta: data.meta || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to search direct messages: ${error.message}`);
  }
}

export async function getNotificationDetails(
  client: TwitterClient,
  _context: Context,
  args: {
    notification_id: string;
  }
): Promise<any> {
  try {
    const data = await client.get(`/tweets/${args.notification_id}`, {
      tweet_fields: 'created_at,author_id,public_metrics,conversation_id',
      expansions: 'author_id',
      user_fields: 'username,created_at,description',
    });

    return {
      notification: data.data || {},
      includes: data.includes || {},
    };
  } catch (error: any) {
    throw new Error(`Failed to get notification details: ${error.message}`);
  }
}
