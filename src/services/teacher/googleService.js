import { api } from "@/config/api";
import { API_ENDPOINTS } from "@/config/constants";

export const getGoogleAccessToken = async (userId, header) => {
    try{    
        const response = await api.get(`${API_ENDPOINTS.GOOGLE.GET_ACCESS_TOKEN}?userId=${userId}`, 
            {
                headers: header
            }
        )
        return response.data;
    }catch(error){
        console.log("Error occurred in fetching User's access token")
        throw error
    }
}

export const saveSheet = async (userId, urlLink, header) => {
    try{
        const response = await api.post(`${API_ENDPOINTS.GOOGLE.SAVE_SHEET}?userId=${userId}&urlLink=${urlLink}`,{},
            {
                headers: header
            }
        )
        return response.data;
    }catch(error){
        console.log("ERROR SAVING SHEETS")
        throw error
    }
}