import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const goHome = () => navigate("/");

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">Unauthorized Access</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this resource.
            </AlertDescription>
          </Alert>
          
          <p className="text-center text-gray-600">
            Please contact your administrator if you believe this is a mistake.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={goHome} variant="default">
            Go to Home
          </Button>
          <Button onClick={goBack} variant="outline">
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
