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