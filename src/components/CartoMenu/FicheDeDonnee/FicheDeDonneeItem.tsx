import { Avatar, Button } from "@mui/joy";
import { useState } from "react";
import { GET_ALL_REQUETE_CARTE_T } from "types";
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
        data
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [selectedIcon, setselectedIcon] = useState(iconList[0]);

    const updateDataIcon = (icon: string) => {
    // Crée une NOUVELLE liste entière en remplaçant uniquement l'élément ciblé
    const newData = data.map((item, i) => {
        if (i === index) {
            return {
                ...item,
                icon, // remplace l'ancienne icône
            };
        }
        return { ...item }; // créer copie des autres éléments pour forcer rerender
    });

    // Mettre à jour le state global
    setRequeteCartoData({ data: newData });

    // Mettre à jour l'état local pour l'affichage immédiat
    setselectedIcon(icon);
};

    return (
        <Button
            variant={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "solid" : "soft"}
            onClick={() => toogleElementInSelectedListe(value)}
            color={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "success" : "neutral"}
            size="sm"
            sx={{
                fontSize: 12
            }}
            endDecorator={
                <Avatar
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
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
