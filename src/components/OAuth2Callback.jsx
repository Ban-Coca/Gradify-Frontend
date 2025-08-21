import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { jwtDecode } from "jwt-decode";

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
        console.log("OAuth2 Callback Parameters:", {
          token: token ? "✓ Present" : "✗ Missing",
          user: userParam ? "✓ Present" : "✗ Missing",
          error: error || "None",
          onboardingRequired: onboardingRequired,
          firstName: firstName,
          lastName: lastName,
          email: email,
          fullURL: location.search,
        });
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

  if (isProcessed) {
    return null; // Don't render anything after processing
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Processing Google login...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
