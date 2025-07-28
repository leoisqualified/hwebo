export const sendSMS = async (to: string, message: string) => {
  // Use Twilio, Termii, or other SMS provider here
  console.log(`📱 SMS to ${to}: ${message}`);
};

export const sendEmail = async (to: string, subject: string, body: string) => {
  // Use Nodemailer, SendGrid, etc.
  console.log(`📧 Email to ${to}: ${subject}\n${body}`);
};
