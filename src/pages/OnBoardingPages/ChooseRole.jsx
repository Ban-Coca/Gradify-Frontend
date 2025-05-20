import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { updateUserRole } from "@/services/user/authenticationService";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function RoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser, updateUserProfile, getAuthHeader } = useAuth();
  const location = useLocation();
  const { formData, setFormData } = useOnboarding();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const userRole = role.toUpperCase();
    setFormData(prev => ({ ...prev, role: userRole }));
  };

  const handleContinue = async () => {
    if (selectedRole === "teacher") {
      navigate("/onboarding/teacher");
    } else if (selectedRole === "student") {
      navigate("/onboarding/student");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
          G
        </div>
        <span className="text-xl font-semibold text-gray-900">Gradify</span>
      </Link>

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          How will you use Gradify?
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          This helps customize your experience
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-2xl gap-6 md:grid-cols-2">
        <div
          className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-green-600 hover:shadow-md ${
            selectedRole === "student"
              ? "border-2 border-green-600 bg-green-50"
              : "border-gray-200"
          }`}
          onClick={() => handleRoleSelect("student")}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            I&apos;m a Student
          </h2>
          <p className="mt-2 text-gray-600">
            Track classes, assignments, and grades in one place
          </p>
        </div>

        <div
          className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-green-600 hover:shadow-md ${
            selectedRole === "teacher"
              ? "border-2 border-green-600 bg-green-50"
              : "border-gray-200"
          }`}
          onClick={() => handleRoleSelect("teacher")}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7 6 13 6 13s6-6 6-13Z" />
              <circle cx="12" cy="8" r="2" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            I&apos;m a Teacher
          </h2>
          <p className="mt-2 text-gray-600">
            Manage classes, track student progress, and upload spreadsheets
          </p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`mt-10 rounded-md px-8 py-3 text-white transition-all ${
          selectedRole
            ? "bg-green-600 hover:bg-green-700"
            : "cursor-not-allowed bg-gray-300"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
