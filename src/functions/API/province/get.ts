import { PROVINCE_T } from "../../../types";
import { axiosInstance } from "constant";

export const getProvince = async (code: string) => {
    try {
        const { data }: { data: any } = await axiosInstance.get(`API/localite/getProvince.php?code=${code}`);
        return data.data as PROVINCE_T;
    }
    catch {
        return false;
    }
}