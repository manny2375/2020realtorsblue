// Email service using SendGrid for real estate notifications
import { DatabaseManager } from './database';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface EmailNotification {
  id?: number;
  userId?: number;
  propertyId?: number;
  agentId?: number;
  type: 'property_inquiry' | 'tour_request' | 'price_alert' | 'new_listing' | 'welcome' | 'password_reset' | 'property_update';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  sentAt?: Date;
  errorMessage?: string;
  templateId?: string;
  templateData?: any;
}

export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  private db: DatabaseManager;

  constructor(apiKey: string, fromEmail: string, fromName: string, database: DatabaseManager) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
    this.fromName = fromName;
    this.db = database;
  }

  // Send email using SendGrid API
  async sendEmail(notification: EmailNotification): Promise<boolean> {
    try {
      // Store notification in database first
      const notificationId = await this.db.createEmailNotification(notification);

      const emailData = {
        personalizations: [{
          to: [{
            email: notification.recipientEmail,
            name: notification.recipientName
          }],
          subject: notification.subject,
          dynamic_template_data: notification.templateData || {}
        }],
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        template_id: notification.templateId,
        // Fallback content if template is not used
        content: notification.templateId ? undefined : [{
          type: 'text/html',
          value: this.generateEmailContent(notification)
        }]
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        // Update notification status to sent
        await this.db.updateEmailNotificationStatus(notificationId, 'sent', new Date());
        return true;
      } else {
        const error = await response.text();
        await this.db.updateEmailNotificationStatus(notificationId, 'failed', undefined, error);
        console.error('SendGrid API error:', error);
        return false;
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  // Send property inquiry notification to agent
  async sendPropertyInquiryNotification(inquiryData: {
    propertyId: number;
    propertyTitle: string;
    propertyAddress: string;
    inquirerName: string;
    inquirerEmail: string;
    inquirerPhone?: string;
    message: string;
    agentEmail: string;
    agentName: string;
  }): Promise<boolean> {
    const notification: EmailNotification = {
      propertyId: inquiryData.propertyId,
      type: 'property_inquiry',
      recipientEmail: inquiryData.agentEmail,
      recipientName: inquiryData.agentName,
      subject: `New Property Inquiry - ${inquiryData.propertyTitle}`,
      status: 'pending',
      templateData: {
        agentName: inquiryData.agentName,
        propertyTitle: inquiryData.propertyTitle,
        propertyAddress: inquiryData.propertyAddress,
        inquirerName: inquiryData.inquirerName,
        inquirerEmail: inquiryData.inquirerEmail,
        inquirerPhone: inquiryData.inquirerPhone || 'Not provided',
        message: inquiryData.message,
        dashboardUrl: `${process.env.CORS_ORIGIN}/agent/dashboard`
      }
    };

    return await this.sendEmail(notification);
  }

  // Send tour request confirmation to client
  async sendTourRequestConfirmation(tourData: {
    propertyId: number;
    propertyTitle: string;
    propertyAddress: string;
    clientName: string;
    clientEmail: string;
    requestedDate?: string;
    agentName: string;
    agentPhone: string;
  }): Promise<boolean> {
    const notification: EmailNotification = {
      propertyId: tourData.propertyId,
      type: 'tour_request',
      recipientEmail: tourData.clientEmail,
      recipientName: tourData.clientName,
      subject: `Tour Request Confirmation - ${tourData.propertyTitle}`,
      status: 'pending',
      templateData: {
        clientName: tourData.clientName,
        propertyTitle: tourData.propertyTitle,
        propertyAddress: tourData.propertyAddress,
        requestedDate: tourData.requestedDate || 'To be scheduled',
        agentName: tourData.agentName,
        agentPhone: tourData.agentPhone,
        propertyUrl: `${process.env.CORS_ORIGIN}/property/${tourData.propertyId}`
      }
    };

    return await this.sendEmail(notification);
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userData: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> {
    const notification: EmailNotification = {
      userId: userData.userId,
      type: 'welcome',
      recipientEmail: userData.email,
      recipientName: `${userData.firstName} ${userData.lastName}`,
      subject: 'Welcome to 20/20 Realtors - Your Real Estate Journey Begins!',
      status: 'pending',
      templateData: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        dashboardUrl: `${process.env.CORS_ORIGIN}/dashboard`,
        propertiesUrl: `${process.env.CORS_ORIGIN}/properties`,
        supportEmail: 'info@2020realtors.com',
        supportPhone: '(714) 262-4263'
      }
    };

    return await this.sendEmail(notification);
  }

  // Send price alert notification
  async sendPriceAlertNotification(alertData: {
    userId: number;
    userEmail: string;
    userName: string;
    propertyId: number;
    propertyTitle: string;
    oldPrice: number;
    newPrice: number;
    priceChange: number;
    changeType: 'increase' | 'decrease';
  }): Promise<boolean> {
    const notification: EmailNotification = {
      userId: alertData.userId,
      propertyId: alertData.propertyId,
      type: 'price_alert',
      recipientEmail: alertData.userEmail,
      recipientName: alertData.userName,
      subject: `Price ${alertData.changeType === 'decrease' ? 'Drop' : 'Increase'} Alert - ${alertData.propertyTitle}`,
      status: 'pending',
      templateData: {
        userName: alertData.userName,
        propertyTitle: alertData.propertyTitle,
        oldPrice: this.formatPrice(alertData.oldPrice),
        newPrice: this.formatPrice(alertData.newPrice),
        priceChange: this.formatPrice(Math.abs(alertData.priceChange)),
        changeType: alertData.changeType,
        changePercentage: Math.round((Math.abs(alertData.priceChange) / alertData.oldPrice) * 100),
        propertyUrl: `${process.env.CORS_ORIGIN}/property/${alertData.propertyId}`
      }
    };

    return await this.sendEmail(notification);
  }

  // Send new listing notification to interested users
  async sendNewListingNotification(listingData: {
    propertyId: number;
    propertyTitle: string;
    propertyAddress: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    userEmail: string;
    userName: string;
    searchCriteria: string;
  }): Promise<boolean> {
    const notification: EmailNotification = {
      propertyId: listingData.propertyId,
      type: 'new_listing',
      recipientEmail: listingData.userEmail,
      recipientName: listingData.userName,
      subject: `New Property Match - ${listingData.propertyTitle}`,
      status: 'pending',
      templateData: {
        userName: listingData.userName,
        propertyTitle: listingData.propertyTitle,
        propertyAddress: listingData.propertyAddress,
        price: this.formatPrice(listingData.price),
        bedrooms: listingData.bedrooms,
        bathrooms: listingData.bathrooms,
        sqft: listingData.sqft.toLocaleString(),
        searchCriteria: listingData.searchCriteria,
        propertyUrl: `${process.env.CORS_ORIGIN}/property/${listingData.propertyId}`,
        unsubscribeUrl: `${process.env.CORS_ORIGIN}/unsubscribe`
      }
    };

    return await this.sendEmail(notification);
  }

  // Generate email content for notifications without templates
  private generateEmailContent(notification: EmailNotification): string {
    switch (notification.type) {
      case 'property_inquiry':
        return this.generatePropertyInquiryEmail(notification.templateData);
      case 'tour_request':
        return this.generateTourRequestEmail(notification.templateData);
      case 'welcome':
        return this.generateWelcomeEmail(notification.templateData);
      case 'price_alert':
        return this.generatePriceAlertEmail(notification.templateData);
      case 'new_listing':
        return this.generateNewListingEmail(notification.templateData);
      default:
        return '<p>Thank you for your interest in 20/20 Realtors.</p>';
    }
  }

  private generatePropertyInquiryEmail(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">New Property Inquiry</h2>
        <p>Hello ${data.agentName},</p>
        <p>You have received a new inquiry for the property:</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin: 0 0 10px 0;">${data.propertyTitle}</h3>
          <p style="margin: 5px 0; color: #64748b;">${data.propertyAddress}</p>
        </div>
        <h3>Contact Information:</h3>
        <ul>
          <li><strong>Name:</strong> ${data.inquirerName}</li>
          <li><strong>Email:</strong> ${data.inquirerEmail}</li>
          <li><strong>Phone:</strong> ${data.inquirerPhone}</li>
        </ul>
        <h3>Message:</h3>
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px;">${data.message}</p>
        <p>Please respond to this inquiry promptly to provide excellent customer service.</p>
        <p>Best regards,<br>20/20 Realtors Team</p>
      </div>
    `;
  }

  private generateTourRequestEmail(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Tour Request Confirmation</h2>
        <p>Hello ${data.clientName},</p>
        <p>Thank you for your interest in scheduling a tour for:</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin: 0 0 10px 0;">${data.propertyTitle}</h3>
          <p style="margin: 5px 0; color: #64748b;">${data.propertyAddress}</p>
        </div>
        <p><strong>Requested Date:</strong> ${data.requestedDate}</p>
        <p>Your assigned agent <strong>${data.agentName}</strong> will contact you at <strong>${data.agentPhone}</strong> within 24 hours to confirm the tour details.</p>
        <p>We look forward to showing you this amazing property!</p>
        <p>Best regards,<br>20/20 Realtors Team</p>
      </div>
    `;
  }

  private generateWelcomeEmail(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Welcome to 20/20 Realtors!</h2>
        <p>Hello ${data.firstName},</p>
        <p>Welcome to 20/20 Realtors! We're excited to help you on your real estate journey.</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6;">What's Next?</h3>
          <ul>
            <li>Browse our extensive property listings</li>
            <li>Save your favorite properties</li>
            <li>Set up price alerts</li>
            <li>Schedule property tours</li>
            <li>Connect with our expert agents</li>
          </ul>
        </div>
        <p>If you have any questions, don't hesitate to contact us:</p>
        <ul>
          <li><strong>Phone:</strong> ${data.supportPhone}</li>
          <li><strong>Email:</strong> ${data.supportEmail}</li>
        </ul>
        <p>Your vision, our mission!</p>
        <p>Best regards,<br>20/20 Realtors Team</p>
      </div>
    `;
  }

  private generatePriceAlertEmail(data: any): string {
    const emoji = data.changeType === 'decrease' ? '📉' : '📈';
    const color = data.changeType === 'decrease' ? '#10b981' : '#ef4444';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${color};">${emoji} Price ${data.changeType === 'decrease' ? 'Drop' : 'Increase'} Alert</h2>
        <p>Hello ${data.userName},</p>
        <p>The price for a property you're watching has changed:</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin: 0 0 10px 0;">${data.propertyTitle}</h3>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span>Previous Price:</span>
            <span style="text-decoration: line-through; color: #64748b;">${data.oldPrice}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span><strong>New Price:</strong></span>
            <span style="color: ${color}; font-weight: bold; font-size: 1.2em;">${data.newPrice}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 10px 0;">
            <span>Change:</span>
            <span style="color: ${color}; font-weight: bold;">
              ${data.changeType === 'decrease' ? '-' : '+'}${data.priceChange} (${data.changePercentage}%)
            </span>
          </div>
        </div>
        <p>Don't miss out on this opportunity! Contact us today to learn more or schedule a viewing.</p>
        <p>Best regards,<br>20/20 Realtors Team</p>
      </div>
    `;
  }

  private generateNewListingEmail(data: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e293b;">🏠 New Property Match!</h2>
        <p>Hello ${data.userName},</p>
        <p>We found a new property that matches your search criteria: <em>${data.searchCriteria}</em></p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #3b82f6; margin: 0 0 10px 0;">${data.propertyTitle}</h3>
          <p style="margin: 5px 0; color: #64748b;">${data.propertyAddress}</p>
          <div style="margin: 15px 0;">
            <span style="font-size: 1.5em; font-weight: bold; color: #1e293b;">${data.price}</span>
          </div>
          <div style="display: flex; gap: 20px; margin: 10px 0;">
            <span><strong>${data.bedrooms}</strong> beds</span>
            <span><strong>${data.bathrooms}</strong> baths</span>
            <span><strong>${data.sqft}</strong> sqft</span>
          </div>
        </div>
        <p>This property just hit the market! Contact us today to schedule a viewing.</p>
        <p>Best regards,<br>20/20 Realtors Team</p>
        <p style="font-size: 0.8em; color: #64748b;">
          <a href="${data.unsubscribeUrl}">Unsubscribe from new listing alerts</a>
        </p>
      </div>
    `;
  }

  private formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCents / 100);
  }

  // Get email notification history
  async getEmailHistory(userId?: number, limit = 50): Promise<EmailNotification[]> {
    return await this.db.getEmailNotifications(userId, limit);
  }

  // Get email statistics
  async getEmailStats(userId?: number): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    byType: Record<string, number>;
  }> {
    return await this.db.getEmailStats(userId);
  }
}