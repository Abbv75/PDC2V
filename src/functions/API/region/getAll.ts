import { LOCALITE_REGION_T, REGION_T } from "../../../types";
import { axiosInstance } from "constant";

export const getAllRegion = async () => {
    try {
        const { data }: { data: any } = await axiosInstance.get(`API/localite/getAllRegion.php`);
        return data.data as LOCALITE_REGION_T[];
    }
    catch {
        return false;
    }
}