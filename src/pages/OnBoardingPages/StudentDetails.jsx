import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/gradifyLogo.svg"; // adjust the path as needed
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/authentication-context";
import { signUpUser, finalizeStudentOnboarding, finalizeGoogleRegistration } from "@/services/user/authenticationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOnboarding } from "@/contexts/onboarding-context";
import { updateRole } from "@/services/user/userService";
import { useDocumentTitle } from "@/hooks/use-document-title";
const formSchema = z.object({
  studentNumber: z.string().min(1, { message: "Student number is required." }),
  major: z.string().min(1, { message: "Major is required." }),
  yearLevel: z.string().min(1, { message: "Year level is required." }),
});

export default function StudentOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const { formData, setFormData } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { login, currentUser, getAuthHeader } = useAuth();
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const helmet = useDocumentTitle("Student Details", "Complete your student profile.");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNumber: formData.studentNumber || "",
      major: formData.major || "",
      yearLevel: formData.yearLevel || "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && currentUser) {
      setIsOAuthUser(true);
    }
  }, [currentUser]);

  async function onSubmit(values) {
  setIsLoading(true);
  setError(null);
    console.log("Form Values:", formData);
    try {
      const isAzureUser = formData.azureId;
      const isGoogleUser = sessionStorage.getItem('googleUserData');
      if(isGoogleUser){
        console.log("Google User", isGoogleUser)
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          azureId: formData.azureId,
          provider: formData.provider || "Google",
          ...values,
        };
        const response = await finalizeGoogleRegistration(onboardingData.role, onboardingData);
        sessionStorage.removeItem("googleUserData");
        localStorage.removeItem("onboardingFormData");
        login(response.userResponse, response.token);
        navigate("/student/dashboard");

      }else if (isAzureUser) {
        // Azure user - create new account with Azure credentials
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          azureId: formData.azureId,
          provider: formData.provider || "Microsoft",
          ...values,
        };

        console.log("Azure Onboarding Data:", onboardingData);

        const response = await finalizeStudentOnboarding(onboardingData);
        console.log("Azure Onboarding Response:", response);

        // Clear session storage after successful signup
        sessionStorage.removeItem("azureUserData");
        localStorage.removeItem("onboardingFormData");

        login(response.userResponse, response.token);
        navigate("/student/dashboard");
      } else if (isOAuthUser) {
        // OAuth user - just update profile details
        const onboardingData = {
          role: formData.role || "STUDENT",
          ...values,
        };

        console.log("OAuth Onboarding Data:", onboardingData);

        const response = await updateRole(
          currentUser.id,
          onboardingData,
        );

        console.log("OAuth Onboarding Response:", response);

        if (response.userResponse && response.token) {
          login(response.userResponse, response.token);
        }

        localStorage.removeItem("onboardingFormData");
        navigate("/student/dashboard");
      } else {
        // Regular signup flow - existing code
        const onboardingData = {
          role: formData.role || "STUDENT",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          provider: formData.provider,
          ...values,
        };

        console.log("Regular Onboarding Data:", onboardingData);

        const response = await signUpUser(onboardingData);
        console.log("Regular Onboarding Response:", response);
        localStorage.removeItem("onboardingFormData");
        login(response.userResponse, response.token);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      let msg = "Profile update failed.";
      const respData = error?.response?.data;

      if (respData) {
        if (typeof respData === "string") {
          msg = respData;
        } else if (respData.message) {
          msg = respData.message;
        } else if (respData.error) {
          msg = respData.error;
        } else if (Array.isArray(respData.errors) && respData.errors.length) {
          msg = respData.errors.map(e => e.message || e).join(", ");
        } else {
          // Fallback - attempt to pretty print the response body
          try {
            msg = JSON.stringify(respData);
          } catch {
            msg = String(respData);
          }
        }
      } else if (error?.message) {
        msg = error.message;
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 pb-4 pt-8">
      {helmet}
      <Link to="/" className="mb-8 flex items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-solid border-primary text-primary-foreground">
          <img src={logo} alt="Logo" className="h-8 w-8" />
        </div>
        <span className="text-xl font-semibold text-gray-900">Gradify</span>
      </Link>

      {/* Improved Back Button */}
      <div className="w-full max-w-md">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-gray-600 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Complete your student profile
        </h1>
        <p className="mt-2 text-base text-gray-600">
          We need a few more details to set up your account
        </p>
      </div>

      <Card className="mt-4 w-full max-w-md">
        <CardContent className="pt-6">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <svg 
                    className="h-4 w-4 text-red-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 mb-1">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-red-700 leading-relaxed mb-2">
                    {error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null);
                        form.reset();
                      }}
                      className="text-red-700 border-red-300 hover:bg-red-100 hover:border-red-400 transition-colors"
                    >
                      Try Again
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/signup")}
                      className="text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Back to Signup
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="studentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Number</FormLabel>
                    <FormControl>
                      <Input placeholder="2023-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Freshman</SelectItem>
                        <SelectItem value="2">Sophomore</SelectItem>
                        <SelectItem value="3">Junior</SelectItem>
                        <SelectItem value="4">Senior</SelectItem>
                        <SelectItem value="5">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
