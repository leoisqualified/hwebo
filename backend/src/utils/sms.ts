// utils/sms.ts
export const sendBidNotificationSMS = async (
  phoneNumber: string,
  supplierName: string,
  bidTitle: string,
  deadline: Date
) => {
  const formattedDeadline = deadline.toLocaleDateString();
  const message = `Hi ${supplierName}, new bid "${bidTitle}" available. Deadline: ${formattedDeadline}. Check your portal.`;

  // Simulate sending SMS (replace with Twilio/Hubtel API later)
  console.log(`📲 Sending SMS to ${phoneNumber}: ${message}`);

  // If using a real provider, implement here and return response
};
