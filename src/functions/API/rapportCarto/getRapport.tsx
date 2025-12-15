import { axiosInstance } from "constant";
import { GET_RAPORT_CARTO_T } from "types";

export default async (code: string | number) => {
    try {
        const { data }: { data: GET_RAPORT_CARTO_T } = await axiosInstance.get(`/fiches/rapport_details_carto_api.php?r=${code}`);
        return data || false;
    }
    catch {
        return false;
    }
}