import { z } from 'zod';
import type { Context } from './configuration';

export const listNotificationsParameters = (context: Context) =>
  z.object({
    limit: z.number().int().min(1).max(100).optional().default(25).describe('Maximum number of notifications to return (default: 25, max: 100)'),
    expand_details: z.boolean().optional().default(false).describe('Include expanded tweet and user details'),
  });

export const markNotificationsAsReadParameters = (context: Context) =>
  z.object({
    notification_ids: z.array(z.string()).describe('List of notification IDs to mark as read'),
  });

export const searchNotificationsParameters = (context: Context) =>
  z.object({
    query: z.string().describe('Search query for notifications'),
    limit: z.number().int().min(1).max(100).optional().default(10).describe('Maximum results to return'),
    notification_type: z.enum(['like', 'retweet', 'reply', 'quote', 'follow', 'mention']).optional().describe('Filter by notification type'),
  });

export const listDirectMessagesParameters = (context: Context) =>
  z.object({
    limit: z.number().int().min(1).max(100).optional().default(50).describe('Maximum number of conversations to return'),
    pagination_token: z.string().optional().describe('Token for pagination to get next set of results'),
  });

export const getDirectMessageConversationParameters = (context: Context) =>
  z.object({
    conversation_id: z.string().describe('The ID of the direct message conversation'),
    limit: z.number().int().min(1).max(100).optional().default(50).describe('Maximum messages to return'),
    pagination_token: z.string().optional().describe('Token for pagination'),
  });

export const sendDirectMessageParameters = (context: Context) =>
  z.object({
    recipient_id: z.string().describe('Twitter user ID of the message recipient'),
    message: z.string().min(1).max(10000).describe('Direct message content (max 10000 characters)'),
    reply_to_message_id: z.string().optional().describe('Message ID to reply to (optional)'),
  });

export const searchDirectMessagesParameters = (context: Context) =>
  z.object({
    query: z.string().describe('Search query for direct messages'),
    limit: z.number().int().min(1).max(100).optional().default(10).describe('Maximum results to return'),
    conversation_with: z.string().optional().describe('Filter results to a specific user ID'),
  });

export const getNotificationDetailsParameters = (context: Context) =>
  z.object({
    notification_id: z.string().describe('The ID of the notification to retrieve'),
  });
