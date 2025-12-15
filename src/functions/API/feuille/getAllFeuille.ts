import { axiosInstance } from "constant";
import { GET_ALL_FEUILLE } from "types";

const getAllFeuille = async ()=> {
    try {
        const { data } = await axiosInstance.get(`API/ficheDynamique/all_feuille_v.php`);
        return data.data.classeurs as GET_ALL_FEUILLE;
    }
    catch {
        return null;
    }
}

export default getAllFeuille