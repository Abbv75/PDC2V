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
        requetesData
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [configModalOpen, setConfigModalOpen] = useState(false);

    // Find matching item in store to get current values
    const storeItem = allRequeteCartoSelected.find(
        item => item.data.Nom_View === value.data.Nom_View
    );

    const currentIcon = storeItem?.icon || value.icon || iconList[0];
    const currentSize = storeItem?.iconSize || value.iconSize || 40;
    const currentSelectedFields = storeItem?.selectedFields || value.selectedFields || [];

    // Find the data list for this item from requetesData
    const requeteDataItem = requetesData.find(
        r => r.title === value.data.intitule
    );
    const currentDataList = requeteDataItem?.data || dataList || [];

    const updateDataIcon = (icon: any) => {
        // Update the store's allRequeteCartoSelected with the new icon
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, icon }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    const updateDataIconSize = (size: number) => {
        // Update the store's allRequeteCartoSelected with the new size
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, iconSize: size }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    const updateSelectedFields = (fields: string[]) => {
        // Update the store's allRequeteCartoSelected with the selected fields
        const updatedSelected = allRequeteCartoSelected.map(item =>
            item.data.Nom_View === value.data.Nom_View
                ? { ...item, selectedFields: fields }
                : item
        );
        setRequeteCartoData({ allRequeteCartoSelected: updatedSelected });
    };

    // Create item value with current settings for toggle
    const getItemValue = () => ({
        ...value,
        icon: currentIcon,
        iconSize: currentSize,
        selectedFields: currentSelectedFields
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
                data={currentDataList}
                fieldKeyListe="*"
            />
        </>
    )
}

