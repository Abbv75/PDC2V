import { axiosInstance } from "constant";
import { GET_REQUETE_CARTE_T } from "types";

const getRequeteCarte = async (viewName: string) => {
    try {
        const { data } = await axiosInstance.get(`API/requeteCarto/getRequeteCarto.php?viewName=${viewName}`);
        return data.data as GET_REQUETE_CARTE_T[];
    }
    catch {
        return null;
    }
}

export default getRequeteCarte