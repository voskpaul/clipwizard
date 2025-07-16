import { type NextRequest, NextResponse } from "next/server"
import { stripeService } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const event = await stripeService.constructWebhookEvent(body, signature)
    await stripeService.handleWebhookEvent(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}
