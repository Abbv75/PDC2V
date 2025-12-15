import { axiosInstance } from "constant";

const createIcon = async (data: any) => {
    try {
        await axiosInstance.post(
            `API/icon_carto/create.php`,
            data ,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        return true;
    }
    catch {
        return null;
    }
}

export default createIcon