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
  const {setFormData: setOnboardingData } = useOnboarding();
  const navigatedRef = useRef(false);

  useEffect(() => {
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
      login(userData, token);
    } else if (exists === "false") {
      const shouldUpdate =
        formData.email !== email ||
        formData.firstName !== firstName ||
        formData.lastName !== lastName ||
        formData.provider !== provider ||
        formData.role !== role;

      if (shouldUpdate) {
        setFormData({
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
          provider: provider || "",
          role: role || "",
        });
        navigatedRef.current = false;
      } else if (!navigatedRef.current) {
        navigatedRef.current = true;
        navigate("/onboarding/role");
      }
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [location.search, setFormData, navigate, formData,login]);

  // When formData changes and matches the params, navigate
  useEffect(() => {
    const {
      exists,
      email,
      firstName,
      lastName,
      provider,
      role,
    } = getOAuthParams(location.search);

    if (
      exists === "false" &&
      email === formData.email &&
      firstName === formData.firstName &&
      lastName === formData.lastName &&
      provider === formData.provider &&
      role === formData.role &&
      !navigatedRef.current
    ) {
      navigatedRef.current = true;
      navigate("/onboarding/role");
    }
    // eslint-disable-next-line
  }, [formData, location.search, navigate]);

  return <div>Processing login...</div>;
};

export default OAuth2Callback;