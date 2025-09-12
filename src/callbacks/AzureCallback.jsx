import { useAuth } from "@/contexts/authentication-context";
import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

const AzureCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isProcessed, setIsProcessed] = useState(false);

    useEffect(() => {
        const processCallback = async () => {
            if (isProcessed) return; // Prevent multiple executions
            const token = searchParams.get('token');
            const error = searchParams.get('error');
            const onboardingRequired = searchParams.get('onboardingRequired');
            const provider = searchParams.get('provider');
            
            // Handle user data - can come as individual params or JSON string
            let userData = null;
            const userJson = searchParams.get('user');
            console.log("user", userJson);
            if (userJson) {
                // New format: user data as JSON string
                try {
                    userData = JSON.parse(decodeURIComponent(userJson));
                } catch (e) {
                    console.error('Failed to parse user JSON:', e);
                    setIsProcessed(true);
                    navigate('/login?error=auth_failed', { replace: true });
                    return;
                }
            } else {
                // Legacy format: individual parameters
                const userId = searchParams.get('userId');
                const email = searchParams.get('email');
                const firstName = searchParams.get('firstName');
                const lastName = searchParams.get('lastName');
                const role = searchParams.get('role');
                const azureId = searchParams.get('azureId');
                
                if (userId || email || firstName || lastName || role) {
                    userData = { userId, email, firstName, lastName, role, azureId };
                }
            }

            try{
                if (error) {
                    console.error('Azure login error:', error);
                    setIsProcessed(true);
                    navigate('/login?error=auth_failed', { replace: true });
                    return;
                }
                
                if (onboardingRequired === 'true') {
                    setIsProcessed(true);
                    // Store Azure user data in sessionStorage for the registration process
                    const azureUserData = {
                        azureId: userData?.azureId || userData?.id,
                        email: userData?.email,
                        firstName: userData?.firstName || '',
                        lastName: userData?.lastName || '',
                        createdAt: userData?.createdAt,
                        provider: userData?.provider || provider,
                        active: userData?.active,
                        userId: userData?.userId,
                        phoneNumber: userData?.phoneNumber,
                        bio: userData?.bio,
                        profilePictureUrl: userData?.profilePictureUrl,
                        institution: userData?.institution,
                        department: userData?.department
                    };
                    sessionStorage.setItem('azureUserData', JSON.stringify(azureUserData));
                    navigate('/onboarding/role', { replace: true });
                    return;
                }

                if (token && userData && provider) {
                    // Normalize user data structure - include all available attributes
                    const user = { 
                        userId: userData.userId || userData.id, 
                        email: userData.email, 
                        firstName: userData.firstName, 
                        lastName: userData.lastName, 
                        role: userData.role,
                        createdAt: userData.createdAt,
                        provider: userData.provider || provider,
                        active: userData.active,
                        phoneNumber: userData.phoneNumber,
                        bio: userData.bio,
                        profilePictureUrl: userData.profilePictureUrl,
                        institution: userData.institution,
                        department: userData.department
                    };
                    await login(user, token); // Make sure login completes
                    setIsProcessed(true);
                    
                    const userRole = userData.role;
                    if (!userRole || userRole == "UNKNOWN") {
                        navigate('/onboarding/role', { replace: true });
                    } else if (userRole === 'TEACHER') {
                        navigate('/teacher/dashboard', { replace: true });
                    } else if (userRole === 'STUDENT') {
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

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    if (isProcessed) {
        return null; // Don't render anything after processing
    }

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="text-center">
                <motion.div variants={itemVariants}>
                    <GraduationCap className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                </motion.div>
                <motion.div
                    className="rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                    variants={itemVariants}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <motion.p className="mt-4 text-muted-foreground" variants={itemVariants}>
                    Processing Microsoft login...
                </motion.p>
            </div>
        </motion.div>
    );
}

export default AzureCallback;