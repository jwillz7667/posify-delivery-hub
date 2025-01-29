export const pincodeConfig = {
  expirationDays: 30, // Pincode expires after 30 days
  warningDays: 3,     // Show warning 3 days before expiration
  defaultPincode: process.env.DEFAULT_PINCODE || '1234',
}; 