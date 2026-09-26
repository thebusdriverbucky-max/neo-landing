import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import {
  BookingInputError,
  escapeHtml,
  parseBookingInput,
} from '@/lib/booking-input';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const requestLimit = await rateLimit(`booking:${ip}`, 5, 60 * 60 * 1000);
  if (!requestLimit.ok) {
    return NextResponse.json(
      { error: 'Too many booking requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(requestLimit.retryAfterSec || 60) },
      },
    );
  }

  try {
    const body = await request.json();
    const { name, phone, email, date, message } = parseBookingInput(body);

    // Rate limiting: check for existing bookings from same email or phone in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingBooking = await prisma.booking.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          { phone: phone }
        ],
        createdAt: {
          gte: tenMinutesAgo
        }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Please wait a few minutes before sending another request.' },
        { status: 429 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        email,
        date,
        message,
      },
    });

    // Send email notification
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (adminEmail) {
      if (!resendApiKey) {
        console.warn('RESEND_API_KEY is missing. Email notification skipped.');
      } else {
        try {
          const resend = new Resend(resendApiKey);
          const safeName = escapeHtml(name);
          const safePhone = escapeHtml(phone);
          const safeEmail = email ? escapeHtml(email) : null;
          const safeDate = date ? escapeHtml(date) : null;
          const safeMessage = message ? escapeHtml(message) : null;
          const adminUrl = process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/admin`
            : null;
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: adminEmail,
            subject: `New Booking Request - ${name}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #1a1a1a; color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">New Booking Request</h1>
              </div>
              <div style="padding: 32px;">
                <div style="margin-bottom: 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 12px; color: #888888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Client Information</p>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; width: 100px; font-weight: 600; color: #666;">Name:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">${safeName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #666;">Phone:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;"><a href="tel:${safePhone}" style="color: #1a1a1a; text-decoration: none; font-weight: 500;">${safePhone}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #666;">Email:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">${safeEmail ? `<a href="mailto:${safeEmail}" style="color: #1a1a1a; text-decoration: none; font-weight: 500;">${safeEmail}</a>` : '<span style="color: #999;">Not provided</span>'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600; color: #666;">Date:</td>
                      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500;">${safeDate || '<span style="color: #999;">Not specified</span>'}</td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-top: 32px;">
                  <p style="margin: 0 0 12px 0; font-size: 12px; color: #888888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Message</p>
                  <div style="background-color: #f8f8f8; padding: 20px; border-radius: 6px; line-height: 1.6; color: #333333; white-space: pre-wrap; border: 1px solid #eeeeee;">${safeMessage || 'No message provided.'}</div>
                </div>
                ${adminUrl ? `
                  <div style="margin-top: 40px; text-align: center;">
                    <a href="${escapeHtml(adminUrl)}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">Open Admin Panel</a>
                  </div>
                ` : ''}
              </div>
              <div style="background-color: #f4f4f4; padding: 16px; text-align: center; font-size: 11px; color: #999999; border-top: 1px solid #e0e0e0;">
                This is an automated notification from your website.
              </div>
            </div>
          `,
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // We don't return error here because the booking was already saved
        }
      }
    }

    return NextResponse.json({ id: booking.id, created: true }, { status: 201 });
  } catch (error) {
    if (error instanceof BookingInputError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: error instanceof BookingInputError ? error.message : 'Invalid JSON body' },
        { status: 400 },
      );
    }
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}
