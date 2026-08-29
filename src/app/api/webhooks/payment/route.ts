import { NextResponse } from 'next/server';
import { addCredits } from '@/lib/credits';

export async function POST(request: Request) {
  try {
    const webhookSecret = request.headers.get('x-webhook-secret');

    // Verify webhook secret
    if (!webhookSecret || webhookSecret !== process.env.PAYMENT_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { workspaceId, amount, event } = body;

    // Validate payload shape
    if (
      !workspaceId ||
      typeof workspaceId !== 'string' ||
      typeof amount !== 'number' ||
      !event ||
      typeof event !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    if (event === 'payment_success') {
      const success = await addCredits(
        workspaceId,
        amount,
        'payment_webhook',
        'Credits added via payment webhook'
      );

      if (!success) {
        return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
      }
    } else {
      // Return 200 for other events without processing
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Payment webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
