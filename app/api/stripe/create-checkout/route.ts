import { type NextRequest, NextResponse } from "next/server"
import { stripeService } from "@/lib/stripe"
import { getCurrentUser, userOperations } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json()
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get or create Stripe customer
    const { data: userData } = await userOperations.findById(user.id)
    let customerId = userData?.stripe_customer_id

    if (!customerId) {
      const customer = await stripeService.createCustomer(user.email!, user.user_metadata?.name || user.email!)
      customerId = customer.id

      // Update user with Stripe customer ID
      await userOperations.updateCredits(user.id, userData?.credits_remaining || 5)
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      priceId,
      customerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    )

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
