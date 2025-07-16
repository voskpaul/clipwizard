import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export interface PricingPlan {
  id: string
  name: string
  price: number
  interval: "month" | "year"
  features: string[]
  stripePriceId: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: ["5 videos per month", "720p export quality", "Basic AI analysis", "Auto captions"],
    stripePriceId: "", // No Stripe price for free plan
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month",
    features: [
      "Unlimited videos",
      "4K export quality",
      "Advanced AI analysis",
      "Custom branding",
      "Priority support",
      "Bulk export",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
  },
]

export class StripeService {
  async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      name,
    })
  }

  async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    })
  }

  async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.retrieve(subscriptionId)
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await stripe.subscriptions.cancel(subscriptionId)
  }

  async constructWebhookEvent(body: string, signature: string): Promise<Stripe.Event> {
    return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
      case "invoice.payment_succeeded":
        await this.handlePaymentSuccess(event.data.object as Stripe.Invoice)
        break
      case "invoice.payment_failed":
        await this.handlePaymentFailure(event.data.object as Stripe.Invoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    // Update user subscription in database
    const customerId = subscription.customer as string

    // This would typically update the user's plan in your database
    console.log("Subscription changed:", subscription.id, subscription.status)
  }

  private async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
    // Handle subscription cancellation
    console.log("Subscription cancelled:", subscription.id)
  }

  private async handlePaymentSuccess(invoice: Stripe.Invoice): Promise<void> {
    // Handle successful payment
    console.log("Payment succeeded:", invoice.id)
  }

  private async handlePaymentFailure(invoice: Stripe.Invoice): Promise<void> {
    // Handle failed payment
    console.log("Payment failed:", invoice.id)
  }
}

export const stripeService = new StripeService()
