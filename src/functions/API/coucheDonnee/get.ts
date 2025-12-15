import { COUCHE_DE_DONNEE_T } from "../../../types";
import { axiosInstance } from "constant";

export const getCoucheDonnee = async () => {
    try {
        const { data }: { data: any } = await axiosInstance.get(`API/localite/getCoucheDonnee.php`);
        return data.data as COUCHE_DE_DONNEE_T[];
    }
    catch {
        return false;
    }
}