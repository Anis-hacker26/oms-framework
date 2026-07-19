export const OrderMessages = {
  // Success Messages
  CREATED: 'Order created successfully.',
  UPDATED: 'Order updated successfully.',
  RETRIEVED: 'Order retrieved successfully.',
  LISTED: 'Orders retrieved successfully.',
  DELETED: 'Order deleted successfully.',
  CANCELLED: 'Order cancelled successfully.',

  // Error Messages
  NOT_FOUND: 'Order not found.',
  ALREADY_EXISTS: 'Order already exists.',
  ORDER_NUMBER_EXISTS: 'Order number already exists.',
  INVALID_STATUS: 'Invalid order status.',
  INVALID_TRANSITION: 'Invalid order status transition.',
  ACCESS_DENIED: 'You do not have permission to access this order.',
  TENANT_MISMATCH: 'Order does not belong to the current tenant.',
  ALREADY_DELETED: 'Order has already been deleted.',
  VERSION_CONFLICT: 'Order has been modified by another user.',

  // Validation Messages
  TITLE_REQUIRED: 'Order title is required.',
  TITLE_TOO_LONG: 'Order title must not exceed 255 characters.',
  DESCRIPTION_TOO_LONG: 'Order description must not exceed 1000 characters.',
  METADATA_INVALID: 'Order metadata must be a valid JSON object.',
} as const;