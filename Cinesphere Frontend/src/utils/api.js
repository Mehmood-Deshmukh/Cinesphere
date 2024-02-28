//For API Calls
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_APP_TOKEN;

const headers = {
    Authorization: "bearer "+TOKEN,
}

//This is further used in a hook For fetching the data
export const fetchData = async (url,params) =>{
    try {
        const {data} = await axios.get(BASE_URL + url,{headers, params})
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}