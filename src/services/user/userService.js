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

export const updateUser = async (userId, payload, header)=>{
    try{
        const response = await api.put(`${API_ENDPOINTS.USER.UPDATE_USER}/${userId}`, payload, 
            {headers: header}
        )
        return response.data
    }catch(error){
        console.log("Error occurred when trying to update user details")
        throw error
    }
}

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