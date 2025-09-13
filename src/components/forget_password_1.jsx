import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { requestPasswordReset } from "@/services/user/authenticationService"
import { motion } from "motion/react"
export function ForgotPasswordForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const buttonHoverVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await requestPasswordReset(email)
      localStorage.setItem("email", email)
      navigate("/verify-code")
    } catch (error) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e) => {
    setEmail(e.target.value)
  }
  return (
    (<motion.form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} >
      <motion.div 
        className="flex flex-col items-center gap-2 text-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We'll help you reset it and get back to your account.
        </p>
      </motion.div>
      <motion.div 
        className="grid gap-6"
        variants={itemVariants}
      >
        <div className="grid gap-3">
          <Label htmlFor="email">Enter your email address here</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="m@example.com"
            value={email}
            onChange={(e) => {
              handleChange(e);
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <motion.div variants={buttonHoverVariants} whileHover="hover">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Verify email"}
          </Button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="text-center text-sm"
        variants={itemVariants}
      >
        Go back to {" "}
        <Link to="/login" className="underline underline-offset-4">
          Log in?
        </Link>
      </motion.div>
    </motion.form>)
  );
}
