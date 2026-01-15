
import { Avatar, Radio, Stack } from "@mui/joy";
import { CardMedia } from "@mui/material";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import useFicheDynamiquesStore from "stores/ficheDynamiques/useFicheDynamiquesStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";
import FicheDynamiqueConfig from "./FicheDynamiqueConfig";

interface ItemProps {
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
}

export default ({ value }: ItemProps) => {
    const { iconList } = useIconMapStore();
    const {
        ficheTitleSelected,
        toogleElementInFicheTitleSelected,
        ficheDynamiquesData,
        getAllFicheData,
        set
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);

    const [configModalOpen, setConfigModalOpen] = useState(false);

    const title = value.feuille.Libelle_Feuille;

    // Get settings from store
    const storeItem = ficheDynamiquesData.find((item: any) => item.title === title);

    // Priority: storeItem settings > defaults
    const currentIcon = storeItem?.icon || iconList[0];
    const currentSize = storeItem?.iconSize || 40;
    const currentSelectedFields = storeItem?.selectedFields || [];
    const currentMarkerTextFont = storeItem?.markerTextFont || {
        fontSize: 'normal',
        fontWeight: 'normal' as const,
        fontFamily: 'Arial',
        fontColor: '#000000',
        bgColor: 'green'
    };

    // Get data list for config
    const currentDataList = value.data || [];

    const updateIcon = (icon: string) => {
        // Update store's data array to preserve icon
        setficheDynamiquesData({
            ficheDynamiquesData: ficheDynamiquesData.some((item: any) => item.title === title)
                ? ficheDynamiquesData.map((item: any) => item.title === title ? { ...item, icon } : item)
                : [...ficheDynamiquesData, {
                    title,
                    icon,
                    iconSize: 40,
                    selectedFields: [],
                    markerTextFont: currentMarkerTextFont
                }]
        });
    };

    const updateIconSize = (size: number) => {
        setficheDynamiquesData({
            ficheDynamiquesData: ficheDynamiquesData.map((item: any) =>
                item.title === title ? { ...item, iconSize: size } : item
            )
        });
    };

    const updateSelectedFields = (fields: string[]) => {
        setficheDynamiquesData({
            ficheDynamiquesData: ficheDynamiquesData.map((item: any) =>
                item.title === title ? { ...item, selectedFields: fields } : item
            )
        });
    };

    const updateMarkerTextFont = (fontConfig: {
        fontSize: number | 'normal';
        fontWeight: 'normal' | 700;
        fontFamily: string;
        fontColor?: string;
        bgColor?: string;
    }) => {
        setficheDynamiquesData({
            ficheDynamiquesData: ficheDynamiquesData.map((item: any) =>
                item.title === title ? {
                    ...item,
                    markerTextFont: fontConfig
                } : item
            )
        });
    };

    return (
        <>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems="center"
            >
                <Radio
                    value={title}
                    label={title}
                    sx={{ fontSize: 10 }}
                    checked={ficheTitleSelected.includes(title)}
                    onClick={() => toogleElementInFicheTitleSelected(title)}
                />

                <Stack direction="row" gap={0.5}>
                    <Avatar
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setConfigModalOpen(true);
                        }}
                        variant="soft"
                        sx={{
                            p: 0.2,
                            width: 25,
                            height: 25,
                            border: `1px solid`,
                            cursor: 'pointer',
                            bgcolor: 'background.level2'
                        }}
                    >
                        <FontAwesomeIcon icon={faCog} style={{ fontSize: 10 }} />
                    </Avatar>

                </Stack>
            </Stack>

            <FicheDynamiqueConfig
                open={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                title={title}
                icon={currentIcon}
                iconSize={currentSize}
                selectedFields={currentSelectedFields}
                onIconChange={updateIcon}
                onIconSizeChange={updateIconSize}
                onSelectedFieldsChange={updateSelectedFields}
                onMarkerTextFontChange={updateMarkerTextFont}
                markerTextFont={currentMarkerTextFont}
                data={currentDataList}
                fieldKeyListe="*"
            />
        </>
    )
}

