import { Avatar, Button, ButtonGroup, Checkbox, LinearProgress, Sheet, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { GET_ALL_REQUETE_CARTE_T, LOADING_STATE_T } from "types";
import getAllRequeteCarte from "functions/API/requeteCartographique/getAllRequeteCarte";
import { AppContext } from "providers";
import ImagePicker from "components/ImagePicker/ImagePicker";
import useRequeteCartoStore from "stores/requeteCarto/useRequeteCartoStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";
import { CardMedia } from "@mui/material";

export default ({ value, index }: {
    value: {
        icon?: any;
        data: GET_ALL_REQUETE_CARTE_T;
    },
    index: number
}) => {
    const { iconList } = useIconMapStore();
    const setIconMapData = useIconMapStore(({ set }) => set);

    const {
        allRequeteCartoSelected,
        toogleElementInSelectedListe,
        data: storeData
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [selectedIcon, setselectedIcon] = useState(iconList[0]);

    const updateDataIcon = (icon: any) => {
        // value contains the actual data from props, not from empty local state
        const updatedItem = { ...value, icon };
        setselectedIcon(icon);
        
        // Update the store with the new icon
        const updatedData = storeData.map((item, idx) => idx === index ? updatedItem : item);
        setRequeteCartoData({ data: updatedData });
    }

    return (
        <Button
            variant={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "solid" : "soft"}
            onClick={() => toogleElementInSelectedListe(value)}
            color={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "success" : "neutral"}
            size="sm"
            sx={{
                fontSize: 12
            }}
            // endDecorator={<ImagePicker
            //     onchange={(icon) => updateDataIcon(icon)}
            // />}
            endDecorator={
                <Avatar
                    size="sm"
                    onClick={() => {
                        setIconMapData({
                            onChange: updateDataIcon,
                            showImagePicker: true,
                        })
                    }}
                    variant='soft'
                    sx={{
                        p: 0.2,
                        width: 15,
                        height: 15,
                        border: `1px solid`,
                        cursor: 'pointer'
                    }}
                >
                    <CardMedia
                        component='img'
                        src={selectedIcon}
                    />
                </Avatar>
            }
        >
            <p style={{ width: '100%', textAlign: "left" }} >
                {value.data.intitule}
            </p>
        </Button>
    )
}
