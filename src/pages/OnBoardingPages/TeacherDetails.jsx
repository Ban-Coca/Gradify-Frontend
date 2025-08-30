import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/gradifyLogo.svg";
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
import { z } from "zod";
import { useAuth } from "@/contexts/authentication-context";
import {
  signUpUser,
  finalizeTeacherOnboarding,
  finalizeGoogleRegistration
} from "@/services/user/authenticationService";
import { useOnboarding } from "@/contexts/onboarding-context";
import { updateRole } from "@/services/user/userService";

const formSchema = z.object({
  institution: z.string().min(1, { message: "Institution is required." }),
  department: z.string().min(1, { message: "Department is required." }),
});

export default function TeacherOnboarding() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser, getAuthHeader } = useAuth();
  const [error, setError] = useState(null);
  const [isOAuthUser, setIsOAuthUser] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      department: "",
    },
  });
  const { formData } = useOnboarding();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && currentUser) {
      setIsOAuthUser(true);
    }
  }, [currentUser]);

  async function onSubmit(values) {
    setIsLoading(true);
    console.log("Form Values:", formData);
    console.log("Current User", currentUser);
    console.log("IS OAUTH USER", isOAuthUser);
    try {
      const isAzureUser = formData.azureId;
      const isGoogleUser = sessionStorage.getItem("googleUserData");

      if (isGoogleUser) {
        const onboardingData = {
          role: formData.role || "TEACHER",
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
          role: formData.role || "TEACHER",
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          azureId: formData.azureId,
          provider: formData.provider || "Microsoft",
          ...values,
        };

        console.log("Azure Onboarding Data:", onboardingData);

        const response = await finalizeTeacherOnboarding(onboardingData);
        console.log("Azure Onboarding Response:", response);

        // Clear session storage after successful signup
        sessionStorage.removeItem("azureUserData");
        localStorage.removeItem("onboardingFormData");

        login(response.userResponse, response.token);
        navigate("/teacher/dashboard");
      } else if (isOAuthUser) {
        // OAuth user - just update profile details

        const onboardingData = {
          role: formData.role || "TEACHER",
          ...values,
        };

        console.log("OAuth Onboarding Data:", onboardingData);

        const response = await updateRole(
          currentUser.userId,
          onboardingData,
        );

        console.log("OAuth Onboarding Response:", response);

        if (response.user && response.token) {
          // Update token in localStorage and context
          localStorage.setItem("token", response.token);
          setToken(response.token); // You'll need to get this from useAuth

          // Update user profile with new data
          updateUserProfile(response.user);
        }
        localStorage.removeItem("onboardingFormData");
        navigate("/teacher/dashboard");
      } else {
        // Regular signup flow - existing code
        const onboardingData = {
          role: formData.role || "TEACHER",
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
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
          className="mb-6 flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="mx-auto max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Complete your teacher profile
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          We need a few more details to set up your account
        </p>
      </div>

      <Card className="mt-10 w-full max-w-md">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
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
