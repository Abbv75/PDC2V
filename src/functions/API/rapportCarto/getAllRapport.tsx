import { axiosInstance } from "constant";
import { GET_ALL_RAPORT_CARTO_T } from "types";

export default async () => {
    try {
        const { data }: { data: GET_ALL_RAPORT_CARTO_T } = await axiosInstance.get(`/fiches/rapport_carto_api.php`);
        return data?.rapports || false;
    }
    catch {
        return false;
    }
}