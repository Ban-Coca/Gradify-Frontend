import axios from 'axios';
import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const signUpUser = async (formData) => {
    try {    
        const response = await api.post(API_ENDPOINTS.USER.REGISTER, formData);
        return response.data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

export const updateUserRole = async (userId, role) => {
    try {
        // No manual headers needed - auth token and content-type are automatic
        const response = await api.put(`${API_ENDPOINTS.USER.UPDATE_ROLE}/${userId}`, { role });
        return response.data;
    } catch (error) {
        console.error('Error updating role:', error);
        throw error;
    }
};

export const loginUser = async (credential) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.USER.LOGIN}`, {
            email: credential.email,
            password: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const requestPasswordReset = async (email) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.USER.REQUEST_PASSWORD_RESET}`, { email });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error);
        throw error;
    }
}

export const verifyResetCode = async (email, code) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.USER.VERIFY_RESET_CODE}`, { 
            email, 
            code 
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying reset code:', error);
        throw error;
    }
}

export const resetPassword = async (credential) => {
    try {
        const response = await api.post(`${API_ENDPOINTS.USER.RESET_PASSWORD}`, {
            email: credential.email,
            resetToken: credential.resetToken,
            newPassword: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

export const completeOnboarding = async (onboardingData, header) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/onboarding`, onboardingData, {
            headers: {
                ...header,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error completing onboarding:', error);
        throw error;
    }
}


export const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

export const azureLogin = async () => {
    try {
        const response = await api.get(`${API_ENDPOINTS.AUTH.AZURE_LOGIN}`);
        if (response.data.authUrl) {
            window.location.href = response.data.authUrl;
        }
        return response.data;
    } catch (error) {
        console.error('Error initiating Azure login:', error);
        throw error;
    }
};

export const finalizeTeacherOnboarding = async (data) => {
    try{
        const response = await api.post(`${API_ENDPOINTS.AUTH.FINALIZE_TEACHER}`, data)
        return response.data;
    } catch (error){
        console.log('Error making teacher account');
        throw error
    }
}

export const checkEmailExists = async (email) => {
    try{
        const response = await api.get(`${API_ENDPOINTS.USER.CHECK_EMAIL_EXISTS}?email=${email}`)
        return response.data
    }catch(error){
        console.log("Email already exists");
        throw error
    }
}

export const finalizeStudentOnboarding = async (data) => {
    try{
        const response = await api.post(`${API_ENDPOINTS.AUTH.FINALIZE_STUDENT}`, data)
        return response.data;
    } catch (error){
        console.log('Error making student account');
        throw error
    }
}

export const finalizeGoogleRegistration = async (role, data) => {
    try{
        const response = await api.post(`${API_ENDPOINTS.AUTH.GOOGLE_FINALIZE}/${role}`, data)
        return response.data
    }catch(error){
        console.log("Error: ", error)
        throw error
    }
}

