import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTPPattern } from "./code_input"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { resetPassword } from "@/services/user/authenticationService"
import { motion } from "motion/react"

export function PasswordResetForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

  useEffect(() => {
    // Get email and resetToken from location state
    if (location.state?.email && location.state?.resetToken) {
      setEmail(location.state.email)
      setResetToken(location.state.resetToken)
    } else {
      setError("Missing required information. Please restart the password reset process.")
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }
      
      if (!email || !resetToken) {
        setError("Missing required information. Please restart the password reset process.")
        return
      }

      const credential = { 
        email, 
        resetToken, 
        password 
      }
      
      const response = await resetPassword(credential)
      if (response.message === "Password reset successfully") {
        navigate("/login")
      } else {
        setError("Failed to reset password. Please try again.")
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }
  return (
    (<motion.form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} >
      <motion.div 
        className="flex flex-col items-center gap-2 text-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-nowrap">Set New Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Verification successful!
        </p>
      </motion.div>
      {error && (
        <motion.div 
          className="text-red-500 text-sm text-center"
          variants={itemVariants}
        >
          {error}
        </motion.div>
      )}
      <motion.div 
        className="grid gap-6"
        variants={itemVariants}
      >
        <div className="grid gap-2">
            <Label htmlFor="password">Enter a new Password</Label>
            <Input 
              id="password" 
              type="password" 
              className="border border-border focus:ring-primary focus:border-primary"
              value={password}
              onChange={handlePasswordChange}
              placeholder="New Password"
              required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              className="border border-border focus:ring-primary focus:border-primary" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              required />
          </div>
          <motion.div variants={buttonHoverVariants} whileHover="hover">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.div>
        </motion.div>
    </motion.form>)
  );
}