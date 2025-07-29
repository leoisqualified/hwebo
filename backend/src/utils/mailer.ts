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
    from: `"HyɛBɔ" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Bid Opportunity: ${bidTitle}`,
    html: `
      <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background-color: #059669;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 5px 5px 0 0;
      }
      .content {
        padding: 20px;
        background-color: #f9f9f9;
        border: 1px solid #e1e1e1;
        border-top: none;
      }
      .footer {
        margin-top: 20px;
        font-size: 0.9em;
        color: #777;
        text-align: center;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #059669;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .button:hover {
        background-color: #047857;
      }
      .highlight {
        background-color: #fffacd;
        padding: 2px 5px;
        border-radius: 3px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h2>New Bid Opportunity</h2>
    </div>

    <div class="content">
      <p>Hello ${supplierName || "Valued Supplier"},</p>

      <p>We're excited to inform you about a new bidding opportunity:</p>

      <h3>${bidTitle}</h3>

      <p>
        <strong>Deadline:</strong>
        <span class="highlight">${formattedDeadline}</span>
      </p>

      <p>
        This is your chance to submit a competitive offer for this procurement
        opportunity.
      </p>

      <center>
        <a href="[YOUR_DASHBOARD_LINK]" class="button">View Bid Details</a>
      </center>

      <p>
        Please ensure to review all requirements and submit your proposal before
        the deadline.
      </p>

      <p>
        If you have any questions about this bid, please don't hesitate to
        contact our support team.
      </p>
    </div>

    <div class="footer">
      <p>
        Best regards,<br />
        <strong>HyɛBɔ Team</strong>
      </p>

      <p>© ${new Date().getFullYear()} HyɛBɔ. All rights reserved.</p>
    </div>
  </body>
</html>
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
  console.log(`Starting batch email to ${suppliers.length} suppliers...`);
  for (let i = 0; i < suppliers.length; i += batchSize) {
    const batch = suppliers.slice(i, i + batchSize);
    console.log(
      `Sending batch ${i / batchSize + 1} (${batch.length} emails)...`
    );

    await Promise.all(
      batch.map((supplier) =>
        sendBidNotificationEmail(
          supplier.email,
          supplier.name,
          bidTitle,
          deadline
        ).catch((err) =>
          console.error(`Email to ${supplier.email} failed:`, err)
        )
      )
    );

    if (i + batchSize < suppliers.length) {
      console.log(`Waiting ${delayMs}ms before next batch...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }

  console.log("All batches processed.");
};
