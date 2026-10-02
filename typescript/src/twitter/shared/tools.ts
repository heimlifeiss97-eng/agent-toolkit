import { z } from 'zod';
import {
  listNotificationsPrompt,
  markNotificationsAsReadPrompt,
  searchNotificationsPrompt,
  listDirectMessagesPrompt,
  getDirectMessageConversationPrompt,
  sendDirectMessagePrompt,
  searchDirectMessagesPrompt,
  getNotificationDetailsPrompt,
} from './prompts';

import {
  listNotificationsParameters,
  markNotificationsAsReadParameters,
  searchNotificationsParameters,
  listDirectMessagesParameters,
  getDirectMessageConversationParameters,
  sendDirectMessageParameters,
  searchDirectMessagesParameters,
  getNotificationDetailsParameters,
} from './parameters';

import type { Context } from './configuration';

export type Tool = {
  method: string;
  name: string;
  description: string;
  parameters: z.ZodObject<any, any, any, any>;
  actions: {
    [key: string]: {
      [action: string]: boolean;
    };
  };
};

const tools = (context: Context): Tool[] => [
  {
    method: 'list_notifications',
    name: 'List Notifications',
    description: listNotificationsPrompt(context),
    parameters: listNotificationsParameters(context),
    actions: {
      notifications: {
        list: true,
      },
    },
  },
  {
    method: 'mark_notifications_as_read',
    name: 'Mark Notifications as Read',
    description: markNotificationsAsReadPrompt(context),
    parameters: markNotificationsAsReadParameters(context),
    actions: {
      notifications: {
        markAsRead: true,
      },
    },
  },
  {
    method: 'search_notifications',
    name: 'Search Notifications',
    description: searchNotificationsPrompt(context),
    parameters: searchNotificationsParameters(context),
    actions: {
      notifications: {
        search: true,
      },
    },
  },
  {
    method: 'list_direct_messages',
    name: 'List Direct Messages',
    description: listDirectMessagesPrompt(context),
    parameters: listDirectMessagesParameters(context),
    actions: {
      directMessages: {
        list: true,
      },
    },
  },
  {
    method: 'get_direct_message_conversation',
    name: 'Get Direct Message Conversation',
    description: getDirectMessageConversationPrompt(context),
    parameters: getDirectMessageConversationParameters(context),
    actions: {
      directMessages: {
        get: true,
      },
    },
  },
  {
    method: 'send_direct_message',
    name: 'Send Direct Message',
    description: sendDirectMessagePrompt(context),
    parameters: sendDirectMessageParameters(context),
    actions: {
      directMessages: {
        send: true,
      },
    },
  },
  {
    method: 'search_direct_messages',
    name: 'Search Direct Messages',
    description: searchDirectMessagesPrompt(context),
    parameters: searchDirectMessagesParameters(context),
    actions: {
      directMessages: {
        search: true,
      },
    },
  },
  {
    method: 'get_notification_details',
    name: 'Get Notification Details',
    description: getNotificationDetailsPrompt(context),
    parameters: getNotificationDetailsParameters(context),
    actions: {
      notifications: {
        list: true,
      },
    },
  },
];

export default tools;

export const ALL_TOOLS_ENABLED = {
  actions: {
    notifications: {
      list: true,
      markAsRead: true,
      search: true,
    },
    directMessages: {
      list: true,
      get: true,
      send: true,
      search: true,
    },
  },
};
