import { useAuth } from "@/contexts/authentication-context";
import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

const AzureCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        const processCallback = async () => {
            if (isProcessed) return; // Prevent multiple executions
            
            const token = searchParams.get('token');
            const userId = searchParams.get('userId');
            const email = searchParams.get('email');
            const name = searchParams.get('name');
            const role = searchParams.get('role');
            const error = searchParams.get('error');
            try{
                if (error) {
                    console.error('Azure login error:', error);
                    setIsProcessed(true);
                    navigate('/login?error=auth_failed', { replace: true });
                    return;
                }

                if (token && userId && email && name) {
                    const user = { userId: userId, email, name, role };
                    await login(user, token); // Make sure login completes
                    setIsProcessed(true);
                    
                    if (!role || role == "UNKNOWN") {
                        navigate('/onboarding/role', { replace: true });
                    } else if (role === 'TEACHER') {
                        navigate('/teacher/dashboard', { replace: true });
                    } else if (role === 'STUDENT') {
                        navigate('/student/dashboard', { replace: true });
                    } else {
                        navigate('/onboarding/role', { replace: true });
                    }
                } else {
                    setIsProcessed(true);
                    navigate('/login?error=auth_failed', { replace: true });
                }
            } catch(error){
                console.error('Azure callback failed:', error);
                setIsProcessed(true);
                navigate('/login?error=auth_failed', { replace: true });
            }
        }

        processCallback();

    }, [searchParams, navigate, login, isProcessed])


    if (isProcessed) {
        return null; // Don't render anything after processing
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Processing Microsoft login...</p>
            </div>
        </div>
    );
}

export default AzureCallback;