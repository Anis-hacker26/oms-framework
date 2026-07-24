export const PaymentMessages = {
  CREATED: 'Payment created successfully.',

  UPDATED: 'Payment updated successfully.',

  DELETED: 'Payment deleted successfully.',

  RETRIEVED: 'Payment retrieved successfully.',

  LISTED: 'Payments retrieved successfully.',

  NOT_FOUND: 'Payment not found.',

  PAYMENT_ALREADY_EXISTS: 'Payment already exists.',

  PAYMENT_ALREADY_CANCELLED: 'Payment is already cancelled.',

  PAYMENT_ALREADY_COMPLETED: 'Completed payments cannot be modified.',

  PAYMENT_ACCESS_DENIED: 'You do not have permission to access this payment.',
} as const;
