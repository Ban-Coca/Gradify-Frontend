import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";

const OAuth2Callback = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOAuth2Success = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/user/oauth2/success", {
          credentials: "include", // Include cookies if needed
        });
        if (response.ok) {
          const data = await response.json();
          const { token, user } = data;

          // Call the login function from the AuthenticationContext
          login(user, token);
        } else {
          console.error("OAuth2 login failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during OAuth2 callback:", error);
        navigate("/login");
      }
    };

    fetchOAuth2Success();
  }, [login, navigate]);

  return <div>Processing login...</div>;
};

export default OAuth2Callback;