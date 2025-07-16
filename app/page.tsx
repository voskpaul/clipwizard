import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { AnimatedBackground } from "@/components/animated-background"
import { ArrowRight, Play, Sparkles, Zap, Shield, Users, Video, Scissors, Brain, Download } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground variant="particles" />

      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ClipWizard
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
            <ThemeToggle />
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Video Generation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Transform Long Videos
            <br />
            Into Viral Clips
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your content and let our AI create engaging short-form videos optimized for TikTok, Instagram Reels,
            and YouTube Shorts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
              >
                Start Creating Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Demo Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-card to-card/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-80 text-primary" />
                <p className="text-lg font-medium">Demo Video</p>
                <p className="text-sm opacity-60">See ClipWizard in action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30 relative">
        <AnimatedBackground variant="waves" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create engaging short-form content from your long videos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-purple-50/50 to-background backdrop-blur-sm dark:from-purple-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Content Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your content to identify the most engaging moments and creates compelling clips
                  automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-blue-50/50 to-background backdrop-blur-sm dark:from-blue-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Scissors className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Video Editing</h3>
                <p className="text-muted-foreground">
                  Advanced FFmpeg integration for precise cutting, merging, and editing with professional-quality
                  output.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-green-50/50 to-background backdrop-blur-sm dark:from-green-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Auto Captions</h3>
                <p className="text-muted-foreground">
                  Generate accurate captions and subtitles automatically using advanced speech recognition technology.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-orange-50/50 to-background backdrop-blur-sm dark:from-orange-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p className="text-muted-foreground">
                  Export in various formats optimized for different social media platforms with one click.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-pink-50/50 to-background backdrop-blur-sm dark:from-pink-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share projects with team members and collaborate on video creation with real-time updates.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-indigo-50/50 to-background backdrop-blur-sm dark:from-indigo-900/10">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Bulk Export</h3>
                <p className="text-muted-foreground">
                  Download multiple clips at once or schedule automatic uploads to your social media accounts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 relative">
        <AnimatedBackground variant="geometric" />
        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your content creation needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 border-2 hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />5 videos per month
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    720p export quality
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Basic AI analysis
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Auto captions
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow relative bg-card/50 backdrop-blur-sm">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600">
                Most Popular
              </Badge>
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">$29</div>
                  <p className="text-muted-foreground">For serious content creators</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Unlimited videos
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    4K export quality
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Advanced AI analysis
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Custom branding
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t py-12 px-4 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ClipWizard</span>
              </div>
              <p className="text-muted-foreground">
                Transform your long-form content into viral short clips with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ClipWizard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
