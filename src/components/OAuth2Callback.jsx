import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    const processCallback = async () => {
      if (isProcessed) return; // Prevent multiple executions

      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const userParam = params.get("user");
      const error = params.get("error");
      const onboardingRequired = params.get("onboardingRequired");
      const firstName = params.get("firstName");
      const lastName = params.get("lastName");
      const email = params.get("email");
      try {
        if (error) {
          console.error("Google OAuth error:", error);
          setIsProcessed(true);
          navigate("/login?error=oauth_failed", { replace: true });
          return;
        }

        if (onboardingRequired === 'true') {
          const googleUserData = {
            email: email,
            firstName: firstName,
            lastName: lastName,
          };
          sessionStorage.setItem(
            "googleUserData",
            JSON.stringify(googleUserData)
          );
          navigate("/onboarding/role", { replace: true });
          return;
        }

        if (token && userParam) {
          // Parse the user data from URL parameter
          const userData = JSON.parse(decodeURIComponent(userParam));

          // Store token in localStorage
          localStorage.setItem("token", token);

          // Always log in the user to store details in localStorage
          await login(userData, token);
          setIsProcessed(true);

          // Check if user needs onboarding (role is PENDING or UNKNOWN)
          if (
            !userData.role ||
            userData.role === "PENDING" ||
            userData.role === "UNKNOWN"
          ) {
            navigate("/onboarding/role", { replace: true });
          } else if (userData.role === "TEACHER") {
            navigate("/teacher/dashboard", { replace: true });
          } else if (userData.role === "STUDENT") {
            navigate("/student/dashboard", { replace: true });
          } else {
            navigate("/onboarding/role", { replace: true });
          }
        } else {
          // No token or user data, redirect to login
          setIsProcessed(true);
          navigate("/login?error=oauth_failed", { replace: true });
        }
      } catch (error) {
        console.error("Google OAuth callback failed:", error);
        setIsProcessed(true);
        navigate("/login?error=oauth_processing_failed", { replace: true });
      }
    };

    processCallback();
  }, [location.search, login, navigate, isProcessed]);

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

  if (isProcessed) {
    return null; // Don't render anything after processing
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center">
        <motion.div variants={itemVariants}>
          <GraduationCap className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        </motion.div>
        <motion.div
          className="rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"
          variants={itemVariants}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.p className="mt-4 text-muted-foreground" variants={itemVariants}>
          Processing Google login...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default OAuth2Callback;
