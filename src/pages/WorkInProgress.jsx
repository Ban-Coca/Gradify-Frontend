import { useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  Hammer,
  Wrench,
  Zap,
} from "lucide-react"
import { motion, useInView } from "framer-motion"
import Lenis from "lenis"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const MotionCard = motion.create(Card)
const MotionLink = motion.create(Link)
const MotionButton = motion.create(Button)

export default function WorkInProgress() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })

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

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
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
        </div>
      </motion.header>

      <main className="flex-1 pt-16">
        <section ref={heroRef} className="w-full h-screen py-12 md:py-16 lg:py-24 xl:pb-32 xl:pt:16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center text-center space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              <motion.div
                className="relative"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center justify-center w-32 h-32 bg-emerald-100 rounded-full mb-6"
                  variants={floatingVariants}
                  animate="animate"
                >
                  <Hammer className="h-16 w-16 text-emerald-600" />
                </motion.div>
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Zap className="h-4 w-4 text-yellow-800" />
                </motion.div>
              </motion.div>

              <motion.div className="space-y-4" variants={itemVariants}>
                <motion.h1
                  className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Work in Progress
                </motion.h1>
                <motion.p
                  className="max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  We're crafting something amazing! This feature is currently under development and will be available soon.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Clock className="h-4 w-4" />
                <span>Expected completion: Coming Soon</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section ref={featuresRef} className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
              variants={containerVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
            >
              <motion.div className="space-y-2" variants={itemVariants}>
                <motion.div
                  className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                  whileHover={{ scale: 1.05 }}
                >
                  Coming Soon
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What We're Building</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Here's a sneak peek at what we're working on to make your experience even better.
                </p>
              </motion.div>
            </motion.div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3">
              {[
                {
                  icon: <Wrench className="h-10 w-10 text-emerald-600" />,
                  title: "Enhanced Features",
                  description: "New tools and capabilities to improve your workflow and productivity.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-emerald-600" />,
                  title: "Performance Improvements",
                  description: "Faster load times and smoother interactions across the platform.",
                },
                {
                  icon: <GraduationCap className="h-10 w-10 text-emerald-600" />,
                  title: "Better User Experience",
                  description: "Intuitive design updates and streamlined navigation for all users.",
                },
              ].map((feature, index) => (
                <MotionCard
                  key={index}
                  className="cursor-pointer"
                  variants={cardHoverVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <CardHeader className="text-center">
                    <motion.div
                      className="mx-auto mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
      </main>

      <motion.footer
        className="w-full border-t bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="container mx-auto px-4 md:px-6 py-12">
          <motion.div
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link to="/">
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold">Gradify</span>
              </motion.div>
            </Link>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Gradify. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}