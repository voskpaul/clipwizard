"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedBackground } from "@/components/animated-background"
import { Scissors, Mail, Lock, Eye, EyeOff, User, Check, AlertCircle } from "lucide-react"

interface PasswordStrength {
  score: number
  feedback: string[]
  suggestions: string[]
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordPopover, setShowPasswordPopover] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  })
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    suggestions: [],
  })

  const analyzePassword = (password: string): PasswordStrength => {
    const feedback: string[] = []
    const suggestions: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 20
      feedback.push("Good length")
    } else {
      suggestions.push("Use at least 8 characters")
    }

    if (/[a-z]/.test(password)) {
      score += 15
      feedback.push("Contains lowercase")
    } else {
      suggestions.push("Add lowercase letters")
    }

    if (/[A-Z]/.test(password)) {
      score += 15
      feedback.push("Contains uppercase")
    } else {
      suggestions.push("Add uppercase letters")
    }

    if (/\d/.test(password)) {
      score += 15
      feedback.push("Contains numbers")
    } else {
      suggestions.push("Add numbers")
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 20
      feedback.push("Contains special characters")
    } else {
      suggestions.push("Add special characters (!@#$%^&*)")
    }

    if (password.length >= 12) {
      score += 15
      feedback.push("Excellent length")
    }

    return { score, feedback, suggestions }
  }

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(analyzePassword(formData.password))
    } else {
      setPasswordStrength({ score: 0, feedback: [], suggestions: [] })
    }
  }, [formData.password])

  const getStrengthColor = (score: number) => {
    if (score < 30) return "bg-red-500"
    if (score < 60) return "bg-yellow-500"
    if (score < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = (score: number) => {
    if (score < 30) return "Weak"
    if (score < 60) return "Fair"
    if (score < 80) return "Good"
    return "Strong"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <AnimatedBackground variant="particles" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ClipWizard
            </span>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Start creating amazing short clips from your videos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Popover open={showPasswordPopover} onOpenChange={setShowPasswordPopover}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onFocus={() => setShowPasswordPopover(true)}
                      className="pl-10 pr-10 bg-background/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-card/95 backdrop-blur-sm" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Strength</span>
                      <Badge variant={passwordStrength.score >= 80 ? "default" : "secondary"}>
                        {getStrengthText(passwordStrength.score)}
                      </Badge>
                    </div>
                    <Progress value={passwordStrength.score} className="h-2" />
                    <div
                      className={`h-1 rounded-full ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />

                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-green-600">✓ Requirements met:</p>
                        {passwordStrength.feedback.map((item, index) => (
                          <div key={index} className="flex items-center text-xs text-green-600">
                            <Check className="w-3 h-3 mr-1" />
                            {item}
                          </div>
                        ))}
                      </div>
                    )}

                    {passwordStrength.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-orange-600">Suggestions:</p>
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center text-xs text-orange-600">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Password strength</span>
                    <span>{getStrengthText(passwordStrength.score)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${passwordStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-purple-600 hover:underline dark:text-purple-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-600 hover:underline dark:text-purple-400">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={!formData.agreeToTerms || passwordStrength.score < 60}
            >
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full bg-background/50">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full bg-background/50">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Twitter
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:underline font-medium dark:text-purple-400">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
