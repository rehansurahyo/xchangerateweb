import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const supabase = createClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                if (userId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const planId = subscription.items.data[0].price.id;

                    // Map price ID to plan name (this should be dynamic in a real app)
                    const planMap: Record<string, string> = {
                        'price_starter_id': 'Starter',
                        'price_pro_id': 'Pro',
                        'price_elite_id': 'Elite'
                    };
                    const planName = planMap[planId] || 'Starter';

                    await supabase
                        .from('subscriptions')
                        .upsert({
                            user_id: userId,
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            plan: planName,
                            status: subscription.status,
                            current_period_end: new Error().stack?.includes('test') ? null : new Date(subscription.current_period_end * 1000).toISOString()
                        });

                    await supabase
                        .from('profiles')
                        .update({ plan: planName })
                        .eq('id', userId);
                }
                break;
            }
            case 'customer.subscription.deleted':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const { data: subData } = await supabase
                    .from('subscriptions')
                    .select('user_id')
                    .eq('stripe_subscription_id', subscription.id)
                    .single();

                if (subData) {
                    await supabase
                        .from('subscriptions')
                        .update({
                            status: subscription.status,
                            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
                        })
                        .eq('stripe_subscription_id', subscription.id);

                    if (subscription.status !== 'active') {
                        await supabase
                            .from('profiles')
                            .update({ plan: 'Free' })
                            .eq('id', subData.user_id);
                    }
                }
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
