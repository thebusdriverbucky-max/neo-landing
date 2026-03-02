import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
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

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}
