export type Context = {
  userId?: string;
  maxResults?: number;
};

export type TwitterActions = {
  notifications?: {
    list?: boolean;
    markAsRead?: boolean;
    search?: boolean;
  };
  directMessages?: {
    list?: boolean;
    get?: boolean;
    send?: boolean;
    search?: boolean;
  };
};

export type Configuration = {
  actions?: TwitterActions;
  context?: Context;
};

export const isToolAllowed = (tool: any, configuration: Configuration): boolean => {
  if (!configuration.actions) {
    return true; // Allow all if not specified
  }

  const actions = configuration.actions;
  
  // Check based on tool method name
  const methodName = tool.method;

  if (methodName.startsWith('list_notifications') && actions.notifications?.list === false) {
    return false;
  }
  if (methodName.startsWith('mark_notifications') && actions.notifications?.markAsRead === false) {
    return false;
  }
  if (methodName.startsWith('search_notifications') && actions.notifications?.search === false) {
    return false;
  }
  if (methodName.startsWith('list_direct_messages') && actions.directMessages?.list === false) {
    return false;
  }
  if (methodName.startsWith('get_direct_message') && actions.directMessages?.get === false) {
    return false;
  }
  if (methodName.startsWith('send_direct_message') && actions.directMessages?.send === false) {
    return false;
  }
  if (methodName.startsWith('search_direct_messages') && actions.directMessages?.search === false) {
    return false;
  }

  return true;
};
