import { axiosInstance } from "constant";
import { GET_ALL_REQUETE_CARTE_T } from "types";

const getAllRequeteCarte = async ()=> {
    try {
        const { data } = await axiosInstance.get(`API/requeteCarto/getAllRequeteCarto.php`);
        return data.data as GET_ALL_REQUETE_CARTE_T[];
    }
    catch {
        return null;
    }
}

export default getAllRequeteCarte