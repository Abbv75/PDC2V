import { Avatar, Button } from "@mui/joy";
import { useState } from "react";
import { GET_ALL_REQUETE_CARTE_T, GET_REQUETE_CARTE_T } from "types";
import useRequeteCartoStore from "stores/requeteCarto/useRequeteCartoStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import ElementConfig from "./ElementConfig";

interface FicheDeDonneeItemProps {
    value: {
        icon?: any;
        iconSize?: number;
        selectedFields?: string[];
        markerTextFont?: {
            fontSize: number | 'normal';
            fontWeight: 'normal' | 700;
            fontFamily: string;
            fontColor?: string;
            bgColor?: string;
        };
        data: GET_ALL_REQUETE_CARTE_T;
    };
    dataList?: GET_REQUETE_CARTE_T[];
    index: number;
}

export default ({ value, dataList, index }: FicheDeDonneeItemProps) => {
    const { iconList } = useIconMapStore();

    const {
        allRequeteCartoSelected,
        toogleElementInSelectedListe,
        requetesData,
        data: storeData
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [configModalOpen, setConfigModalOpen] = useState(false);

    // Get settings from storeData (preserved even when deselected)
    const storeItem = storeData.find(
        item => item.data.Nom_View === value.data.Nom_View
    );

    // Priority: storeItem settings > value props > defaults
    const currentIcon = storeItem?.icon || value.icon || iconList[0];
    const currentSize = storeItem?.iconSize || value.iconSize || 40;
    const currentSelectedFields = storeItem?.selectedFields || value.selectedFields || [];
    const currentMarkerTextFont = storeItem?.markerTextFont || value.markerTextFont || {
        fontSize: 'normal',
        fontWeight: 'normal' as const,
        fontFamily: 'Arial',
        fontColor: '#000000',
        bgColor: 'green'
    };

    // Find the data list for this item from requetesData
    const requeteDataItem = requetesData.find(
        r => r.title === value.data.intitule
    );
    const currentDataList = requeteDataItem?.data || dataList || [];

    const saveSettingsToStoreData = (updates: { 
        icon?: any; 
        iconSize?: number; 
        selectedFields?: string[];
        markerTextFont?: {
            fontSize: number | 'normal';
            fontWeight: 'normal' | 700;
            fontFamily: string;
            fontColor?: string;
            bgColor?: string;
        };
    }) => {
        // Update the store's data array to preserve settings when deselected
        const updatedData = storeData.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, ...updates }
                : item
        );
        setRequeteCartoData({ data: updatedData });
    };

    const updateDataIcon = (icon: any) => {
        // Update store's data array to preserve icon
        saveSettingsToStoreData({ icon });
        
        // Also update allRequeteCartoSelected if item is currently selected
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, icon }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    const updateDataIconSize = (size: number) => {
        // Update store's data array to preserve size
        saveSettingsToStoreData({ iconSize: size });
        
        // Also update allRequeteCartoSelected if item is currently selected
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, iconSize: size }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    const updateSelectedFields = (fields: string[]) => {
        // Update store's data array to preserve selected fields
        saveSettingsToStoreData({ selectedFields: fields });
        
        // Also update allRequeteCartoSelected if item is currently selected
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, selectedFields: fields }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    const updateMarkerTextFont = (fontConfig: {
        fontSize: number | 'normal';
        fontWeight: 'normal' | 700;
        fontFamily: string;
        fontColor?: string;
        bgColor?: string;
    }) => {
        // Update store's data array to preserve font settings
        saveSettingsToStoreData({ markerTextFont: fontConfig });
        
        // Also update allRequeteCartoSelected if item is currently selected
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, markerTextFont: fontConfig }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    // Create item value with preserved settings for toggle
    const getItemValue = () => ({
        data: value.data,
        icon: currentIcon,
        iconSize: currentSize,
        selectedFields: currentSelectedFields,
        markerTextFont: currentMarkerTextFont
    });

    return (
        <>
            <Button
                variant={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "solid" : "soft"}
                onClick={() => toogleElementInSelectedListe(getItemValue())}
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
                            setConfigModalOpen(true);
                        }}
                        variant='soft'
                        sx={{
                            p: 0.2,
                            width: 25,
                            height: 25,
                            border: `1px solid`,
                            cursor: 'pointer',
                            bgcolor: 'background.level2'
                        }}
                    >
                        <FontAwesomeIcon icon={faCog} style={{ fontSize: 12 }} />
                    </Avatar>
                }
            >
                <p style={{ width: '100%', textAlign: "left" }} >
                    {value.data.intitule}
                </p>
            </Button>

            <ElementConfig
                open={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                title={value.data.intitule}
                icon={currentIcon}
                iconSize={currentSize}
                selectedFields={currentSelectedFields}
                onIconChange={updateDataIcon}
                onIconSizeChange={updateDataIconSize}
                onSelectedFieldsChange={updateSelectedFields}
                onMarkerTextFontChange={updateMarkerTextFont}
                markerTextFont={currentMarkerTextFont}
                data={currentDataList}
                fieldKeyListe="*"
            />
        </>
    )
}

