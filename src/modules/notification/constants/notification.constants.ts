export const NOTIFICATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  DEFAULT_SORT_BY: 'createdAt',
  DEFAULT_SORT_ORDER: 'desc',

  TITLE_MAX_LENGTH: 255,

  SUCCESS_MESSAGES: {
    CREATED: 'Notification created successfully.',
    RETRIEVED: 'Notification retrieved successfully.',
    LISTED: 'Notifications retrieved successfully.',
    UPDATED: 'Notification updated successfully.',
    READ: 'Notification marked as read successfully.',
    ARCHIVED: 'Notification archived successfully.',
  },

  ERROR_MESSAGES: {
    NOT_FOUND: 'Notification not found.',
    ALREADY_ARCHIVED: 'Notification is already archived.',
    ALREADY_READ: 'Notification has already been marked as read.',
    VERSION_MISMATCH:
      'Notification has been modified by another transaction.',
  },
} as const;