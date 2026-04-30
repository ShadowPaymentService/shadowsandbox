'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, Zap, Check } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Starter',
    credits: 100,
    price: 9,
    features: ['100 AI credits', 'Basic support', '5 projects'],
  },
  {
    name: 'Pro',
    credits: 500,
    price: 29,
    popular: true,
    features: ['500 AI credits', 'Priority support', 'Unlimited projects', 'GitHub integration'],
  },
  {
    name: 'Beast',
    credits: 2000,
    price: 79,
    features: ['2000 AI credits', '24/7 support', 'Unlimited projects', 'GitHub integration', 'Team collaboration'],
  },
]

export default function BillingPage() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary neon-glow mb-2 flex items-center justify-center gap-3">
            <Coins className="h-8 w-8" />
            Credits
          </h1>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> Power up your coding with more credits
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-card/50 border-border relative ${
                plan.popular ? 'border-primary neon-border' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Zap className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  {plan.credits} credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/one-time</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-primary/10 border border-primary/50 text-primary hover:bg-primary/20'
                  }`}
                >
                  Get {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <Card className="bg-card/50 border-border mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">What are credits used for?</h4>
              <p className="text-sm text-muted-foreground">
                Credits power the AI assistant in your IDE, helping you write code faster.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Do credits expire?</h4>
              <p className="text-sm text-muted-foreground">
                No, purchased credits never expire and remain in your account.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Can I get a refund?</h4>
              <p className="text-sm text-muted-foreground">
                Unused credits can be refunded within 30 days of purchase.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
