// utils/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBidNotificationEmail = async (
  to: string,
  supplierName: string,
  bidTitle: string,
  deadline: Date
) => {
  const formattedDeadline = deadline.toDateString();
  const mailOptions = {
    from: `"Procurement Platform" <${process.env.SMTP_USER}>`,
    to,
    subject: `📢 New Bid Opportunity: ${bidTitle}`,
    html: `
      <p>Hello ${supplierName || "Supplier"},</p>
      <p>A new bid titled <strong>${bidTitle}</strong> has been created with a deadline of <strong>${formattedDeadline}</strong>.</p>
      <p>Please log in to your dashboard to view the details and place your offer.</p>
      <p>Thank you,<br/>Procurement Platform Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const batchSendBidNotifications = async (
  suppliers: { email: string; name: string }[],
  bidTitle: string,
  deadline: Date,
  batchSize = 10,
  delayMs = 2000
) => {
  console.log(`🔔 Starting batch email to ${suppliers.length} suppliers...`);
  for (let i = 0; i < suppliers.length; i += batchSize) {
    const batch = suppliers.slice(i, i + batchSize);
    console.log(
      `📤 Sending batch ${i / batchSize + 1} (${batch.length} emails)...`
    );

    await Promise.all(
      batch.map((supplier) =>
        sendBidNotificationEmail(
          supplier.email,
          supplier.name,
          bidTitle,
          deadline
        ).catch((err) =>
          console.error(`❌ Email to ${supplier.email} failed:`, err)
        )
      )
    );

    if (i + batchSize < suppliers.length) {
      console.log(`⏳ Waiting ${delayMs}ms before next batch...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  console.log("✅ All batches processed.");
};
