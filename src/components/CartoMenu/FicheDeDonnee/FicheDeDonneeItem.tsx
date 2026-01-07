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
    } = useRequeteCartoStore();

    const [selectedIcon, setselectedIcon] = useState(iconList[0]);

    const [data, setdata] = useState([] as { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[]);

    const updateDataIcon = (icon: any) => {
        const newData = [...data];
        newData[index].icon = icon;
        setdata(newData);
        setselectedIcon(icon);
        // setIconMapData({showImagePicker : false})
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
