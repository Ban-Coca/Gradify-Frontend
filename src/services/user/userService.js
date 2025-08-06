import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_USER_SERVICE

export const updateRole = async (userId, payload, header) => {
    try{
        const response = await axios.put(`${API_BASE_URL}/update-user/${userId}`, payload,
        {
            headers: header
        }
        )
        return response.data;
    } catch(error){
        console.log("error updating the role")
        throw error;
    }
}