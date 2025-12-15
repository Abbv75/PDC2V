import { RESPONSE_T, VILLAGE_T } from "../../../types";
import { axiosInstance } from "constant";

export const getVillage = async (code: string) => {
    try {
        const { data }: { data: RESPONSE_T } = await axiosInstance.get(`API/localite/getVillage.php?code=${code}`);
        return data.data[0] as VILLAGE_T;
    }
    catch {
        return false;
    }
}