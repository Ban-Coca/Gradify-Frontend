import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { deleteClass } from "@/services/teacher/classServices";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/authentication-context";
export default function DeleteClassConfirmation({ classId, className, onClassDeleted }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();
  // Function to handle authentication issues
  const handleAuthError = () => {
    console.log("Authentication error detected, redirecting to login");
    setError("Your session has expired. Redirecting to login...");
    
    // Clear any stored tokens
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate("/login", { 
        state: { 
          redirectUrl: window.location.pathname,
          message: "Please log in again to continue."
        }
      });
    }, 1500);
  };

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setIsCheckingConnection(true);
      
      const authHeader = getAuthHeader();
      
      // Basic validation of auth header
      if (!authHeader || !authHeader.Authorization) {
        console.error("Missing or invalid Authorization header");
        handleAuthError();
        return;
      }
      // Call the API
      await deleteClass(classId, authHeader);
      
      console.log(`Successfully deleted class ${classId}`);
      
      // Close the dialog
      setOpen(false);

      // Show success toast
      toast.success(`Class "${className}" deleted successfully`, {
        icon: "🗑️",
        position: "bottom-right",
        duration: 3000,
        style: {
          borderRadius: '8px',
          background: '#fef2f2',
          color: '#991b1b',
        },
      });
      
      // Call the callback function to update UI
      if (onClassDeleted) {
        onClassDeleted(className);
      }
    } catch (error) {
      console.error("Delete class error:", error);
      
      // Handle specific error messages
      const errorMessage = error.message || "An unknown error occurred";
      setError(errorMessage);
      
      // Check for server connection errors
      if (errorMessage.includes("Server connection failed")) {
        // This is a server connection issue - we could offer a retry option
        console.log("Server connection failed - backend may not be running");
      }
      // Check for authentication errors
      else if (
        errorMessage.includes("session expired") || 
        errorMessage.includes("please log in") || 
        errorMessage.includes("authentication failed")
      ) {
        handleAuthError();
      }
    } finally {
      setIsDeleting(false);
      setIsCheckingConnection(false);
    }
  };

  // Error display component with icon
  const ErrorDisplay = ({ message }) => (
    <div className="flex items-start gap-2 text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Class
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the class
              <span className="font-semibold"> {className}</span>, all student records,
              assignments, and grades associated with it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <p className="text-sm font-medium mb-2">
              Type <span className="font-bold">delete</span> to confirm:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="w-full"
              autoFocus
            />
            {error && <ErrorDisplay message={error} />}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={isDeleting}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={confirmText.toLowerCase() !== "delete" || isDeleting}
              className="w-full sm:w-auto sm:order-2"
            >
              {isCheckingConnection ? "Checking Connection..." : 
               isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}