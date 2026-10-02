import type { Context } from './configuration';

export const listNotificationsPrompt = (context: Context): string =>
  `Fetch the authenticated user's notifications. Returns recent notifications with tweet/account information. Can filter by limit and include expanded tweet/user details.`;

export const markNotificationsAsReadPrompt = (context: Context): string =>
  `Mark one or more notifications as read to update their read status. Helps organize and manage notification inbox.`;

export const searchNotificationsPrompt = (context: Context): string =>
  `Search through notifications using keywords, filters like date ranges, notification type, or author. Returns filtered notification results.`;

export const listDirectMessagesPrompt = (context: Context): string =>
  `List direct message conversations for the authenticated user. Returns conversation list with the most recent messages and participant information.`;

export const getDirectMessageConversationPrompt = (context: Context): string =>
  `Retrieve a specific direct message conversation with detailed message history. Returns all messages in the conversation between the authenticated user and another account.`;

export const sendDirectMessagePrompt = (context: Context): string =>
  `Send a direct message to another Twitter user. Requires the recipient's user ID and message content. The message is sent immediately.`;

export const searchDirectMessagesPrompt = (context: Context): string =>
  `Search through direct messages using keywords or filters. Returns DM results matching the search criteria across all conversations.`;

export const getNotificationDetailsPrompt = (context: Context): string =>
  `Get detailed information about a specific notification including the associated tweet, engagement metrics, and timestamp.`;
