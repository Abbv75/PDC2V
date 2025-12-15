import { COMMUNE_T } from "../../../types";
import { axiosInstance } from "constant";

export const getCommune = async (code: string) => {
    try {
        const { data }: { data: any } = await axiosInstance.get(`API/localite/getCommune.php?code=${code}`);
        return data.data as COMMUNE_T;
    }
    catch {
        return false;
    }
}