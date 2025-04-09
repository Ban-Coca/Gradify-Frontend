import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER_SERVICE

export const signUpUser = async (formData) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/postuserrecord`, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        });
        return response.data;
    } catch (error){
        console.error('Error signing up:', error);
        throw error;
    }
}

export const loginUser = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            email: credential.email,
            password: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/verify-email`, { email });
        return response.data;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

export const resetPassword = async (credential) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            email: credential.email,
            NewPassword: credential.password,
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

export const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

export const microsoftLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/microsoft";
};