import { axiosInstance } from "constant";
import { ICON_T } from "types";

const getAllIcon = async () => {
    try {
        const { data } = await axiosInstance.get(`API/icon_carto/getAll.php`);
        return data.data as ICON_T[];
    }
    catch {
        return null;
    }
}

export default getAllIcon