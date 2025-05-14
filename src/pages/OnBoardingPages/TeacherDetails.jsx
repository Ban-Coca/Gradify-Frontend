import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
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
import { signUpUser } from "@/services/user/authenticationService";
import { useOnboarding } from "@/contexts/onboarding-context";

const formSchema = z.object({
  institution: z.string().min(1, { message: "Institution is required." }),
  department: z.string().min(1, { message: "Department is required." }),
});

export default function TeacherOnboarding() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      department: "",
    },
  });
  const { formData } = useOnboarding();

  async function onSubmit(values) {
    setIsLoading(true);
    console.log("Form Values:", formData);
    try {
      const onboardingData = {
        role: formData.role || "TEACHER",
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        ...values,
      };

      console.log("Onboarding Data:", onboardingData);
      try {
        setIsLoading(true);
        const response = await signUpUser(onboardingData);
        console.log("Onboarding Response:", onboardingData);
        localStorage.removeItem("onboardingFormData")
        login(response.user, response.token);
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred during signup."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
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
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
          G
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
