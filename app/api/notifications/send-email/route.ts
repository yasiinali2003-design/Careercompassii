/**
 * API Route: Send Email Notification
 * POST /api/notifications/send-email
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  generateClassCompletionEmail, 
  generateAtRiskStudentEmail, 
  generateWeeklySummaryEmail,
  EmailNotification 
} from '@/lib/emailNotifications';

// Email sending function - can be configured to use Resend, SendGrid, etc.
async function sendEmail(notification: EmailNotification): Promise<boolean> {
  try {
    // Option 1: Use Resend (recommended for production)
    // Install: npm install resend
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL || 'noreply@careercompassi.com',
    //   to: notification.to,
    //   subject: notification.subject,
    //   html: notification.html,
    //   text: notification.text,
    // });

    // Option 2: Use SendGrid
    // Install: npm install @sendgrid/mail
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({
    //   to: notification.to,
    //   from: process.env.FROM_EMAIL || 'noreply@careercompassi.com',
    //   subject: notification.subject,
    //   html: notification.html,
    //   text: notification.text,
    // });

    // Option 3: Use Nodemailer with SMTP (works with any SMTP provider)
    // Install: npm install nodemailer
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    // await transporter.sendMail({
    //   from: process.env.FROM_EMAIL || 'noreply@careercompassi.com',
    //   to: notification.to,
    //   subject: notification.subject,
    //   html: notification.html,
    //   text: notification.text,
    // });

    // For now, log the email (in production, replace with actual email sending)
    console.log('📧 Email would be sent:', {
      to: notification.to,
      subject: notification.subject,
    });
    
    // In development, you might want to return true to simulate success
    // In production, uncomment one of the email services above
    return process.env.NODE_ENV === 'development' ? true : false;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing type or data' },
        { status: 400 }
      );
    }

    let notification: EmailNotification;

    switch (type) {
      case 'class_completion':
        notification = generateClassCompletionEmail(data);
        break;
      case 'at_risk_student':
        notification = generateAtRiskStudentEmail(data);
        break;
      case 'weekly_summary':
        notification = generateWeeklySummaryEmail(data);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    const success = await sendEmail(notification);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

