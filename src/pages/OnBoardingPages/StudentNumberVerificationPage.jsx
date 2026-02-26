import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "@/assets/gradifyLogo.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTPPattern } from "@/components/code_input";
import { useAuth } from "@/contexts/authentication-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import {
  signUpUser,
  finalizeStudentOnboarding,
  finalizeGoogleRegistration,
  verifyStudentNumber,
  sendStudentNumberVerification,
} from "@/services/user/authenticationService";
import { updateRole } from "@/services/user/userService";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function StudentNumberVerificationPage() {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const { formData } = useOnboarding();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const helmet = useDocumentTitle(
    "Verify Student Number",
    "Enter the verification code sent to your email."
  );

  const email = formData.email || currentUser?.email;

  useEffect(() => {
    // If there is no email or student number, redirect back to the student details page
    if (!email || !formData.studentNumber) {
      navigate("/onboarding/student");
    }
  }, [email, formData.studentNumber, navigate]);

  const handleCodeChange = (value) => {
    setCode(value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Verify the code
      await verifyStudentNumber(email, code);

      // Proceed with onboarding after successful verification
      const isAzureUser = formData.azureId;
      const isGoogleUser = sessionStorage.getItem("googleUserData");
      const isOAuthUser = !!localStorage.getItem("token") && !!currentUser;

      const studentValues = {
        studentNumber: formData.studentNumber,
        major: formData.major,
        yearLevel: formData.yearLevel,
      };

      if (isGoogleUser) {
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          azureId: formData.azureId,
          provider: formData.provider || "Google",
          ...studentValues,
        };
        const response = await finalizeGoogleRegistration(
          onboardingData.role,
          onboardingData
        );
        sessionStorage.removeItem("googleUserData");
        localStorage.removeItem("onboardingFormData");
        login(response.userResponse, response.token);
      } else if (isAzureUser) {
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          azureId: formData.azureId,
          provider: formData.provider || "Microsoft",
          ...studentValues,
        };
        const response = await finalizeStudentOnboarding(onboardingData);
        sessionStorage.removeItem("azureUserData");
        localStorage.removeItem("onboardingFormData");
        login(response.userResponse, response.token);
      } else if (isOAuthUser) {
        const onboardingData = {
          role: formData.role || "STUDENT",
          ...studentValues,
        };
        const response = await updateRole(currentUser.id, onboardingData);
        if (response.userResponse && response.token) {
          login(response.userResponse, response.token);
        }
        localStorage.removeItem("onboardingFormData");
        navigate("/student/dashboard");
      } else {
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          provider: formData.provider,
          ...studentValues,
        };
        const response = await signUpUser(onboardingData);
        localStorage.removeItem("onboardingFormData");
        login(response.userResponse, response.token);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
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
      await sendStudentNumberVerification(email);
      setResendMessage("A new verification code has been sent to your email.");
    } catch (err) {
      console.error("Resend failed:", err);
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-neutral-900 px-4 pb-4 pt-8">
      {helmet}
      <Link to="/" className="mb-8 flex items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-solid border-primary text-primary-foreground">
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </div>
        <span className="text-xl font-semibold text-gray-900 dark:text-white">
          Gradify
        </span>
      </Link>

      <div className="w-full max-w-md">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/onboarding/student")}
          className="mb-6 flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify your student number
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
          We&apos;ve sent a verification code to{" "}
          <span className="font-medium text-gray-900 dark:text-white">
            {email}
          </span>
          . Enter the code below to confirm your student number.
        </p>
      </div>

      <Card className="mt-6 w-full max-w-md">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enter the 6-digit code sent to your email
              </p>
              <div className="flex items-center justify-center gap-2">
                <InputOTPPattern
                  value={code}
                  onChange={handleCodeChange}
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    variants={alertVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Alert
                      variant="destructive"
                      className="relative border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800"
                    >
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200 pr-8">
                        {error}
                      </AlertDescription>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
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

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Complete Setup"}
            </Button>

            <div className="text-center text-sm">
              <Button
                type="button"
                variant="link"
                onClick={handleResendCode}
                disabled={isResending}
                className="p-0 h-auto font-normal text-primary hover:text-primary/80"
              >
                {isResending ? "Sending..." : "Didn't receive the code? Resend"}
              </Button>
            </div>

            <AnimatePresence>
              {resendMessage && (
                <motion.div
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Alert className="relative border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-200 pr-8">
                      {resendMessage}
                    </AlertDescription>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setResendMessage("")}
                      className="absolute top-2 right-2 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
