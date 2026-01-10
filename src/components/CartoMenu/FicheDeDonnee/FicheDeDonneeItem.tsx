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
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [selectedIcon, setselectedIcon] = useState(iconList[0]);

    // Update selected icon when prop value.icon changes
    useEffect(() => {
        if (value.icon) {
            setselectedIcon(value.icon);
        }
    }, [value.icon]);

    const updateDataIcon = (icon: any) => {
        setselectedIcon(icon);
        
        // Update the store's allRequeteCartoSelected with the new icon
        // This preserves the selected items without triggering unnecessary data reloads
        const updatedSelected = allRequeteCartoSelected.map(item => 
            item.data.Nom_View === value.data.Nom_View 
                ? { ...item, icon } 
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
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
