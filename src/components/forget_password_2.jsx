import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTPPattern } from "./code_input"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { verifyResetCode, resendCode } from "@/services/user/authenticationService"
import { motion, AnimatePresence } from "motion/react"
import { X, AlertCircle, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

export function EnterCodeForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

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

  const alertVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  }

  useEffect(() => {
    // Set email from localStorage when component mounts
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleCodeChange = (value) => {
    setCode(value);
    console.log("Code entered:", value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submitting code:", code);
    setIsLoading(true);
    setError("");

    try {
      const response = await verifyResetCode(email, code);
      
      // Store the reset token and email for the next step
      navigate("/reset-password", { 
        state: { 
          email: email, 
          resetToken: response.resetToken 
        } 
      });
    } catch (error) {
      console.error("Verification failed:", error);
      setError(
        error.response?.data?.error || 
        "Invalid or expired verification code. Please try again or request a new code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");
    setResendMessage("");

    try {
      await resendCode(email);
      setResendMessage("A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Resend failed:", error);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    (<motion.form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit} initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} >
      <motion.div 
        className="flex flex-col items-center gap-2 text-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl font-bold text-nowrap">Check Your Email for Reset Code</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We've sent a verification code to your email to reset your password
        </p>
      </motion.div>
      <motion.div 
        className="grid gap-6"
        variants={itemVariants}
      >
        <div className="grid gap-3">
          <Label htmlFor="code">Enter the code sent to you here</Label>
          <div className="flex items-center justify-center gap-2">
            <InputOTPPattern 
              id="code" 
              type="text" 
              value={code}
              onChange={handleCodeChange}
              placeholder="XXXXXX" 
              className="border border-border focus:ring-primary focus:border-primary"  
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
                <Alert
                  variant="destructive"
                  className="relative border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200 pr-8">{error}</AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setError("")}
                    className="absolute top-2 right-2 h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-200 dark:hover:bg-red-900/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div variants={buttonHoverVariants} whileHover="hover">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Verify code"}
          </Button>
        </motion.div>
        <motion.div 
          className="text-center text-sm"
          variants={itemVariants}
        >
          <Button 
            type="button" 
            variant="link" 
            onClick={handleResendCode} 
            disabled={isResending}
            className="p-0 h-auto font-normal text-primary hover:text-primary/80"
          >
            {isResending ? "Sending..." : "Didn't receive the code? Resend"}
          </Button>
        </motion.div>
        <AnimatePresence>
          {resendMessage && (
            <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
              <Alert className="relative border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200 pr-8">{resendMessage}</AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setResendMessage("")}
                  className="absolute top-2 right-2 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
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