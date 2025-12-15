import { REGION_T } from "../../../types";
import { axiosInstance } from "constant";

export const getRegion = async (code: string) => {
    try {
        const { data }: { data: any } = await axiosInstance.get(`API/localite/getRegion.php?code=${code}`);
        return data.data as REGION_T;
    }
    catch {
        return false;
    }
}