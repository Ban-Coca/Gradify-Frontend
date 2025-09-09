import axios from 'axios';
import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const updateRole = async (userId, payload) => {
    try{
        const response = await api.put(`${API_ENDPOINTS.USER.UPDATE_ROLE}/${userId}`, payload
        )
        return response.data;
    } catch(error){
        console.log("error updating the role")
        throw error;
    }
}

export const updateUser = async (userId, payload, header) => {
    try {
        // Determine content type based on payload type
        const isFormData = payload instanceof FormData;
        
        if (isFormData) {
            for (let [key, value] of payload.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }
        }

        const config = {
            headers: {
                ...header,
                ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
            }
        };

        const response = await api.put(
            `${API_ENDPOINTS.USER.UPDATE_USER}/${userId}`, 
            payload, 
            config
        );
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserDetails = async (userId, header) => {
    try{
        const response = await api.get(`${API_ENDPOINTS.USER.GET_BY_ID}/${userId}`, 
            {headers: header} 
        )
        
        console.log('✅ Response received:', response.data);
        return response.data
    }catch(error){
        console.log("Failed fetching user data")
        throw error
    }
}