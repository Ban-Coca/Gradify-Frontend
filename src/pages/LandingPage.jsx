import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ChevronRight,
  Clock,
  GraduationCap,
  LineChart,
  MessageSquare,
  PieChart,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom" // Added React Router import

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Gradify</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link to="#benefits" className="text-sm font-medium hover:underline underline-offset-4">
              Benefits
            </Link>
            <Link to="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link to="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
              Log In
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Transform Academic Performance with Real-Time Insights
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Gradify is an intelligent grade management system that provides real-time tracking and predictive
                    insights to empower both students and teachers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/signup">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      Start Free Trial
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg" variant="outline">
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Gradify Dashboard Preview"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Intelligent Grade Management</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Gradify offers powerful tools to track, analyze, and improve academic performance in real-time.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Real-Time Analytics</CardTitle>
                  <CardDescription>
                    Track academic performance with instant updates and comprehensive dashboards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Customizable dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Performance trends</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Subject-specific insights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BrainCircuit className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Predictive Insights</CardTitle>
                  <CardDescription>
                    AI-powered predictions to identify areas for improvement and growth.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Grade projections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Personalized recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Early intervention alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-emerald-600" />
                  <CardTitle>Communication Tools</CardTitle>
                  <CardDescription>Seamless communication between students, teachers, and parents.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Automated progress reports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Direct messaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Feedback system</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>For Students</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Empower Your Academic Journey
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Take control of your education with personalized insights and tools designed to help you succeed.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <LineChart className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Track Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitor your grades and performance across all subjects in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Time Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Optimize study time with personalized schedules based on your performance data.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <PieChart className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Goal Setting</h3>
                      <p className="text-sm text-muted-foreground">
                        Set and track academic goals with actionable steps to achieve them.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Learning Resources</h3>
                      <p className="text-sm text-muted-foreground">
                        Access recommended resources tailored to your learning needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700 flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>For Teachers</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Transform Your Teaching Approach
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Gain valuable insights into student performance to deliver more effective and personalized
                    education.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Users className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Class Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Get a comprehensive view of class performance and identify trends.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BrainCircuit className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Early Intervention</h3>
                      <p className="text-sm text-muted-foreground">
                        Identify at-risk students early with AI-powered alerts and recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BarChart3 className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Assessment Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        Analyze assessment effectiveness and student performance patterns.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-1 h-5 w-5 text-emerald-600" />
                    <div className="space-y-1">
                      <h3 className="font-medium">Streamlined Communication</h3>
                      <p className="text-sm text-muted-foreground">
                        Easily share feedback and communicate with students and parents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Educators and Students</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users have to say about how Gradify has transformed their academic experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card className="border-emerald-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      width={60}
                      height={60}
                      alt="Teacher Avatar"
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                      <CardDescription>High School Math Teacher</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Gradify has completely transformed how I manage my classroom. The predictive insights help me
                    identify struggling students before they fall behind, and the analytics make parent-teacher
                    conferences so much more productive."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-emerald-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      width={60}
                      height={60}
                      alt="Student Avatar"
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">Michael Chen</CardTitle>
                      <CardDescription>College Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "As a student juggling multiple courses, Gradify helps me stay on top of my academic performance.
                    The goal-setting features and personalized recommendations have helped me improve my GPA
                    significantly."
                  </p>
                </CardContent>
              </Card>
              <Card className="border-emerald-200">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src="/placeholder.svg?height=60&width=60"
                      width={60}
                      height={60}
                      alt="Administrator Avatar"
                      className="rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">Dr. Patricia Rivera</CardTitle>
                      <CardDescription>School Principal</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Implementing Gradify across our school has led to measurable improvements in student outcomes. The
                    data-driven insights help our teachers provide more targeted support, and parents appreciate the
                    transparency."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">Pricing</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your educational needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <div className="text-3xl font-bold">
                    $9<span className="text-sm font-normal text-muted-foreground">/month per teacher</span>
                  </div>
                  <CardDescription>Perfect for individual teachers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Up to 5 classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full">Start Free Trial</Button>
                </div>
              </Card>
              <Card className="border-emerald-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>Pro</CardTitle>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Popular</span>
                  </div>
                  <div className="text-3xl font-bold">
                    $19<span className="text-sm font-normal text-muted-foreground">/month per teacher</span>
                  </div>
                  <CardDescription>Ideal for departments and schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Unlimited classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Predictive insights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Start Free Trial</Button>
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="text-3xl font-bold">Custom</div>
                  <CardDescription>For districts and large institutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>All Pro features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>Dedicated account manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span>24/7 premium support</span>
                    </li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Academic Performance?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of educators and students who are already using Gradify to achieve academic excellence.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container mx-auto flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Product</h3>
              <nav className="flex flex-col gap-2">
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Features
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Pricing
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Integrations
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Updates
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Resources</h3>
              <nav className="flex flex-col gap-2">
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Documentation
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Tutorials
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Webinars
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Blog
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Company</h3>
              <nav className="flex flex-col gap-2">
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  About
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Careers
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Press
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Legal</h3>
              <nav className="flex flex-col gap-2">
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Terms
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Privacy
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Cookies
                </Link>
                <Link to="#" className="text-sm hover:underline underline-offset-4">
                  Licenses
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2 md:col-span-1">
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <p className="text-sm text-muted-foreground">Subscribe to our newsletter for updates and tips.</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button type="submit" variant="outline" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold">Gradify</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Gradify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
