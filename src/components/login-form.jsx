import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth} from "@/contexts/authentication-context"
import { loginUser} from "@/services/authenticationService"
export function LoginForm({
  className,
  ...props
}) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({ email: false, password: false });
    const email = formData.email;
    const password = formData.password;
    
    // Input validation
    if (!email) {
      setFieldErrors(prev => ({ ...prev, email: true }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: true }));
      return;
    }
    if (!password) {
      setFieldErrors(prev => ({ ...prev, password: true }));
      return;
    }

    const credential = { email, password };
    try {
      setLoading(true);
      setError(null);
      const response = await loginUser(credential);
      const {user, token} = response;
      login(user, token);
      // navigate("/home");
      console.log(response);
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    
    (<form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e);
              if(fieldErrors.email) {
                setFieldErrors(prev => ({ ...prev, email: false }));
                setError(null);
              }
            }}
            className={fieldErrors.email ? "border-red-500" : ""}
             />
            {fieldErrors.email && <p className="text-xs text-red-500">Please enter a valid email address</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password"
            name="password"
            type="password" 
            value={formData.password}
            onChange={(e) => {
              handleInputChange(e);
              if (fieldErrors.password) {
                setFieldErrors(prev => ({ ...prev, password: false }));
                setError(null);
              }
            }}
            className={fieldErrors.password ? "border-red-500" : ""}
          />
          {fieldErrors.password && <p className="text-xs text-red-500">Password is required</p>}
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3 grid-cols-2"> 
          <Button variant="outline" className="w-full ">
            <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
              <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-40.298 31.187C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
              <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82L15.26 71.312C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
              <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
            </svg>
          </Button>
          <Button variant="outline" className="w-full ">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path fill="#F35325" d="M1 1h6.5v6.5H1V1z"></path>
              <path fill="#81BC06" d="M8.5 1H15v6.5H8.5V1z"></path>
              <path fill="#05A6F0" d="M1 8.5h6.5V15H1V8.5z"></path>
              <path fill="#FFBA08" d="M8.5 8.5H15V15H8.5V8.5z"></path>
            </svg>
          </Button> 
        </div>
        
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>)
  );
}
