import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { useOnboarding } from "@/contexts/onboarding-context";
import { jwtDecode } from "jwt-decode";

const getOAuthParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    exists: params.get("exists"),
    token: params.get("token"),
    email: params.get("email"),
    firstName: params.get("firstName"),
    lastName: params.get("lastName"),
    provider: params.get("provider"),
    role: params.get("role"),
  };
};

const OAuth2Callback = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    provider: "Email"
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setFormData: setOnboardingData } = useOnboarding();
  const actionRef = useRef(false);

  useEffect(() => {
    if (actionRef.current) return; // Prevent repeated actions

    const {
      exists,
      token,
      email,
      firstName,
      lastName,
      provider,
      role,
    } = getOAuthParams(location.search);

    if (exists === "true" && token) {
      const userData = jwtDecode(token);
      actionRef.current = true;
      login(userData, token);
    } else if (exists === "false") {
      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        provider: provider || "",
        role: role || "",
      });
      setOnboardingData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        provider: provider || "",
        role: role || "",
      });
      actionRef.current = true;
      navigate("/onboarding/role");
    } else {
      actionRef.current = true;
      navigate("/login");
    }
    // Only run on mount or when location.search changes
    // eslint-disable-next-line
  }, [location.search]);

  return null;
};

export default OAuth2Callback;