// Email sending utility using Nodemailer
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, orderDetails) => {
  try {
    const itemsHtml = orderDetails.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
      `
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderDetails.orderId}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for your purchase! Your order has been received.</p>
        
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Quantity</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <h3 style="margin-top: 20px;">Total: $${orderDetails.totalPrice.toFixed(2)}</h3>
        
        <p style="margin-top: 20px;">We will keep you updated on your order status. Thank you for shopping with us!</p>
        <p>Best regards,<br>Perfume E-commerce Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
};
