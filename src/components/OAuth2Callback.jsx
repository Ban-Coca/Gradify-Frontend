import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";

const OAuth2Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const user = JSON.parse(queryParams.get("user"));

    if (token && user) {
      login(user, token); // Call the login function from the AuthenticationContext
    } else {
      console.error("Invalid OAuth2 callback response");
      navigate("/login"); // Redirect to login page on failure
    }
  }, [location, login, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuth2Callback;