import { Avatar, Radio, Stack } from "@mui/joy";
import { CardMedia } from "@mui/material";
import { useState } from "react";
import useFicheDynamiquesStore from "stores/ficheDynamiques/useFicheDynamiquesStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";

export default ({ value }: {
    value: {
        feuille: {
            Libelle_Classeur: string;
            Code_Feuille: string;
            Table_Feuille: string;
            Libelle_Feuille: string;
        };
        lignes: {
            Libelle_Ligne: string;
            Nom_Collone: string;
        }[];
        data: {
            Id: string;
            Stat: string;
            Date_Insertion: string;
            Login: string;
            LG: string | null;
            LT: string | null;
            [key: string]: string | null;
        }[];
    }
}) => {

    const {
        ficheTitleSelected,
        toogleElementInFicheTitleSelected,
        ficheDynamiquesData
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);

    const {iconList, } = useIconMapStore();
    const setIconMapData = useIconMapStore((state) => state.set);

    const updateIcon = (icon: any) => {
        const feuille = value.feuille.Libelle_Feuille;
        setficheDynamiquesData({
            ficheDynamiquesData: ficheDynamiquesData.some((item: any) => item.feuille === feuille)
                ? ficheDynamiquesData.map((item: any) => item.feuille === feuille ? { ...item, icon } : item)
                : [...ficheDynamiquesData, { feuille, icon }]
        });

        setselectedIcon(icon);
    };

    const [selectedIcon, setselectedIcon] = useState(iconList[0]);

    return (
        <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems="center"
        >
            <Radio
                value={value.feuille.Libelle_Feuille}
                label={value.feuille.Libelle_Feuille}
                sx={{ fontSize: 10 }}
                checked={ficheTitleSelected.includes(value.feuille.Libelle_Feuille)}
                onClick={() => toogleElementInFicheTitleSelected(value.feuille.Libelle_Feuille)}
            />

            <Avatar>
                <CardMedia
                    component='img'
                    src={selectedIcon}
                    onClick={()=>{
                        setIconMapData({
                            showImagePicker : true,
                            onChange: updateIcon
                        })
                    }}
                />
            </Avatar>
        </Stack>
    )
}