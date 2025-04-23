"use client"

import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
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
import { motion, useInView, useScroll } from "framer-motion"
import Lenis from "lenis"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const MotionCard = motion.create(Card)
const MotionLink = motion.create(Link)
const MotionButton = motion.create(Button)

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const benefitsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.3 })
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 })
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    // Integrate with Framer Motion's useScroll
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle anchor link smooth scrolling
    const handleAnchorLinkClick = (e) => {
      const href = e.currentTarget.getAttribute("href")

      if (href?.startsWith("#")) {
        e.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          lenis.scrollTo(targetElement, {
            offset: -100, // Offset to account for fixed header
            duration: 1.2,
          })
        }
      }
    }

    // Add click event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorLinkClick)
    })

    return () => {
      // Clean up
      lenis.destroy()
      anchorLinks.forEach((link) => {
        link.removeEventListener("click", handleAnchorLinkClick)
      })
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header
        className="border-b fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold">Gradify</span>
              </div>
            </Link>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            {[
              { name: "Features", id: "features" },
              { name: "Benefits", id: "benefits" },
              { name: "Testimonials", id: "testimonials" },
              { name: "Pricing", id: "pricing" },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
              >
                <a href={`#${item.id}`} className="text-sm font-medium hover:underline underline-offset-4">
                  {item.name}
                </a>
              </motion.div>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link to="/login" className="text-sm font-medium hover:underline underline-offset-4">
                Log In
              </Link>
            </motion.div>
            <MotionLink
              to="/signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button>Get Started</Button>
            </MotionLink>
          </div>
        </div>
      </motion.header>
      <main className="flex-1 pt-16">
        <section id="home" ref={heroRef} className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <motion.div className="flex flex-col justify-center space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <motion.h1
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    initial={{ opacity: 0, x: -20 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    Transform Academic Performance with Real-Time Insights
                  </motion.h1>
                  <motion.p
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                    initial={{ opacity: 0 }}
                    animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    Gradify is an intelligent grade management system that provides real-time tracking and predictive
                    insights to empower both students and teachers.
                  </motion.p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <MotionLink
                    to="/signup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Start Free Trial
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </MotionLink>
                  <MotionLink
                    to="/demo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" variant="outline">
                      Schedule Demo
                    </Button>
                  </MotionLink>
                </motion.div>
                <motion.div
                  className="flex items-center gap-4 text-sm"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>14-day free trial</span>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Gradify Dashboard Preview"
                  className="rounded-lg object-cover shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <motion.div
                  className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                  whileHover={{ scale: 1.05 }}
                >
                  Key Features
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Intelligent Grade Management</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Gradify offers powerful tools to track, analyze, and improve academic performance in real-time.
                </p>
              </motion.div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  icon: <BarChart3 className="h-10 w-10 text-emerald-600" />,
                  title: "Real-Time Analytics",
                  description: "Track academic performance with instant updates and comprehensive dashboards.",
                  features: ["Customizable dashboards", "Performance trends", "Subject-specific insights"],
                },
                {
                  icon: <BrainCircuit className="h-10 w-10 text-emerald-600" />,
                  title: "Predictive Insights",
                  description: "AI-powered predictions to identify areas for improvement and growth.",
                  features: ["Grade projections", "Personalized recommendations", "Early intervention alerts"],
                },
                {
                  icon: <MessageSquare className="h-10 w-10 text-emerald-600" />,
                  title: "Communication Tools",
                  description: "Seamless communication between students, teachers, and parents.",
                  features: ["Automated progress reports", "Direct messaging", "Feedback system"],
                },
              ].map((feature, i) => (
                <MotionCard
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <CardHeader>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={featuresInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 + 0.1 * i }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.ul
                      className="grid gap-2 text-sm"
                      initial="hidden"
                      animate={featuresInView ? "visible" : "hidden"}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3 + 0.1 * i,
                          },
                        },
                      }}
                    >
                      {feature.features.map((item, j) => (
                        <motion.li
                          key={j}
                          className="flex items-center gap-2"
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" ref={benefitsRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="grid gap-6 lg:grid-cols-2 lg:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate={benefitsInView ? "visible" : "hidden"}
            >
              <motion.div className="flex flex-col justify-center space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <motion.div
                    className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    For Students
                  </motion.div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Empower Your Academic Journey
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Take control of your education with personalized insights and tools designed to help you succeed.
                  </p>
                </div>
                <motion.div
                  className="grid gap-4 md:grid-cols-2"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  }}
                >
                  {[
                    {
                      icon: <LineChart className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Track Progress",
                      description: "Monitor your grades and performance across all subjects in real-time.",
                    },
                    {
                      icon: <Clock className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Time Management",
                      description: "Optimize study time with personalized schedules based on your performance data.",
                    },
                    {
                      icon: <PieChart className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Goal Setting",
                      description: "Set and track academic goals with actionable steps to achieve them.",
                    },
                    {
                      icon: <BookOpen className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Learning Resources",
                      description: "Access recommended resources tailored to your learning needs.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                      }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      {item.icon}
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div className="flex flex-col justify-center space-y-4" variants={itemVariants}>
                <div className="space-y-2">
                  <motion.div
                    className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    For Teachers
                  </motion.div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Transform Your Teaching Approach
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Gain valuable insights into student performance to deliver more effective and personalized
                    education.
                  </p>
                </div>
                <motion.div
                  className="grid gap-4 md:grid-cols-2"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.4,
                      },
                    },
                  }}
                >
                  {[
                    {
                      icon: <Users className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Class Overview",
                      description: "Get a comprehensive view of class performance and identify trends.",
                    },
                    {
                      icon: <BrainCircuit className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Early Intervention",
                      description: "Identify at-risk students early with AI-powered alerts and recommendations.",
                    },
                    {
                      icon: <BarChart3 className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Assessment Analytics",
                      description: "Analyze assessment effectiveness and student performance patterns.",
                    },
                    {
                      icon: <MessageSquare className="mt-1 h-5 w-5 text-emerald-600" />,
                      title: "Streamlined Communication",
                      description: "Easily share feedback and communicate with students and parents.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-2"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                      }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    >
                      {item.icon}
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="testimonials" ref={testimonialsRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={testimonialsInView ? "visible" : "hidden"}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <motion.div
                  className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                  whileHover={{ scale: 1.05 }}
                >
                  Testimonials
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Educators and Students</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our users have to say about how Gradify has transformed their academic experience.
                </p>
              </motion.div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  role: "High School Math Teacher",
                  testimonial:
                    "Gradify has completely transformed how I manage my classroom. The predictive insights help me identify struggling students before they fall behind, and the analytics make parent-teacher conferences so much more productive.",
                },
                {
                  name: "Michael Chen",
                  role: "College Student",
                  testimonial:
                    "As a student juggling multiple courses, Gradify helps me stay on top of my academic performance. The goal-setting features and personalized recommendations have helped me improve my GPA significantly.",
                },
                {
                  name: "Dr. Patricia Rivera",
                  role: "School Principal",
                  testimonial:
                    "Implementing Gradify across our school has led to measurable improvements in student outcomes. The data-driven insights help our teachers provide more targeted support, and parents appreciate the transparency.",
                },
              ].map((testimonial, i) => (
                <MotionCard
                  key={i}
                  className="border-emerald-200"
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={testimonialsInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 + 0.1 * i }}
                      >
                        <img
                          src="/placeholder.svg?height=60&width=60"
                          width={60}
                          height={60}
                          alt={`${testimonial.name} Avatar`}
                          className="rounded-full"
                        />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={testimonialsInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + 0.1 * i }}
                    >
                      "{testimonial.testimonial}"
                    </motion.p>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" ref={pricingRef} className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={pricingInView ? "visible" : "hidden"}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <motion.div
                  className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                  whileHover={{ scale: 1.05 }}
                >
                  Pricing
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your educational needs.
                </p>
              </motion.div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  title: "Basic",
                  price: "$9",
                  description: "Perfect for individual teachers",
                  features: ["Up to 5 classes", "Basic analytics", "Email support"],
                  popular: false,
                  link: "/signup?plan=basic"
                },
                {
                  title: "Pro",
                  price: "$19",
                  description: "Ideal for departments and schools",
                  features: ["Unlimited classes", "Advanced analytics", "Predictive insights", "Priority support"],
                  popular: true,
                  link: "/signup?plan=pro"
                },
                {
                  title: "Enterprise",
                  price: "Custom",
                  description: "For districts and large institutions",
                  features: [
                    "All Pro features",
                    "Custom integrations",
                    "Dedicated account manager",
                    "24/7 premium support",
                  ],
                  popular: false,
                  link: "/contact"
                },
              ].map((plan, i) => (
                <MotionCard
                  key={i}
                  className={plan.popular ? "border-emerald-200 shadow-lg" : ""}
                  initial={{ opacity: 0, y: 30 }}
                  animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.2 * i }}
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle>{plan.title}</CardTitle>
                      {plan.popular && (
                        <motion.span
                          className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700"
                          initial={{ scale: 0 }}
                          animate={pricingInView ? { scale: 1 } : { scale: 0 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                        >
                          Popular
                        </motion.span>
                      )}
                    </div>
                    <div className="text-3xl font-bold">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/month per teacher</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.ul
                      className="mt-auto grid gap-2 text-sm"
                      initial="hidden"
                      animate={pricingInView ? "visible" : "hidden"}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.3 + 0.1 * i,
                          },
                        },
                      }}
                    >
                      {plan.features.map((feature, j) => (
                        <motion.li
                          key={j}
                          className="flex items-center gap-2"
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                  <div className="mt-auto p-6 pt-0">
                    <MotionLink to={plan.link}>
                      <Button
                        className={`w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                        variant={plan.title === "Enterprise" ? "outline" : "default"}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {plan.title === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                      </Button>
                    </MotionLink>
                  </div>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>

        <section ref={ctaRef} className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Academic Performance?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of educators and students who are already using Gradify to achieve academic excellence.
                </p>
              </motion.div>
              <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={itemVariants}>
                <MotionLink to="/signup">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Free Trial
                  </Button>
                </MotionLink>
                <MotionLink to="/demo">
                  <Button size="lg" variant="outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Schedule Demo
                  </Button>
                </MotionLink>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        className="border-t bg-muted/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto flex flex-col gap-6 py-8 md:py-12 px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              {
                title: "Product",
                links: [
                  { name: "Features", path: "#features" },
                  { name: "Pricing", path: "#pricing" },
                  { name: "Integrations", path: "/integrations" },
                  { name: "Updates", path: "/updates" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { name: "Documentation", path: "/docs" },
                  { name: "Tutorials", path: "/tutorials" },
                  { name: "Webinars", path: "/webinars" },
                  { name: "Blog", path: "/blog" },
                ],
              },
              {
                title: "Company",
                links: [
                  { name: "About", path: "/about" },
                  { name: "Careers", path: "/careers" },
                  { name: "Press", path: "/press" },
                  { name: "Contact", path: "/contact" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { name: "Terms", path: "/terms" },
                  { name: "Privacy", path: "/privacy" },
                  { name: "Cookies", path: "/cookies" },
                  { name: "Licenses", path: "/licenses" },
                ],
              },
            ].map((section, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <nav className="flex flex-col gap-2">
                  {section.links.map((link, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * i + 0.05 * j }}
                    >
                      {link.path.startsWith('#') ? (
                        <a href={link.path} className="text-sm hover:underline underline-offset-4">
                          {link.name}
                        </a>
                      ) : (
                        <Link to={link.path} className="text-sm hover:underline underline-offset-4">
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            ))}
            <motion.div
              className="flex flex-col gap-2 sm:col-span-2 md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <p className="text-sm text-muted-foreground">Subscribe to our newsletter for updates and tips.</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <MotionButton
                  type="submit"
                  variant="outline"
                  size="sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </MotionButton>
              </form>
            </motion.div>
          </div>
          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <a href={'#home'}>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold">Gradify</span>
              </motion.div>
            </a>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Gradify. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
