import React, { useEffect, useRef, useCallback } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { toast } from 'react-toastify';
import { GET_REQUETE_CARTE_T } from '../../types';
import getRequeteCarte from 'functions/API/requeteCartographique/getRequeteCarte';
import useRequeteCartoStore from 'stores/requeteCarto/useRequeteCartoStore';

interface REQUETE_DATA_T {
    title?: string,
    data: GET_REQUETE_CARTE_T[],
    icon?: any
}

const FicheDeDonneeElement = () => {    
    const { allRequeteCartoSelected, requetesData } = useRequeteCartoStore();
    const setrequetesData = useRequeteCartoStore(state => state.set);
    
    // Track previous selected items to avoid unnecessary reloads
    const prevSelectedRef = useRef<string[]>([]);

    const loadListe = useCallback(async () => {
        // Get current selected item IDs
        const currentIds = allRequeteCartoSelected.map(item => item.data.Nom_View);
        const prevIds = prevSelectedRef.current;

        // Check if the actual items changed (not just icons)
        const itemsChanged = 
            currentIds.length !== prevIds.length ||
            currentIds.some(id => !prevIds.includes(id));

        // Update ref for next comparison
        prevSelectedRef.current = currentIds;

        // Only reload if items actually changed or if no data exists
        if (!itemsChanged && requetesData.length > 0) {
            // Just update icons in existing data without reloading
            const updatedData = requetesData.map((reqData, idx) => {
                const matchingItem = allRequeteCartoSelected[idx];
                if (matchingItem && matchingItem.icon !== reqData.icon) {
                    return { ...reqData, icon: matchingItem.icon };
                }
                return reqData;
            });
            
            // Only update if icons actually changed
            const iconsChanged = updatedData.some((item, idx) => item.icon !== requetesData[idx]?.icon);
            if (iconsChanged) {
                setrequetesData({ requetesData: updatedData });
            }
            return;
        }

        try {
            if (!allRequeteCartoSelected.length) {
                // Clear existing data when nothing is selected
                setrequetesData({ requetesData: [] });
                return;
            }

            // Use a simple for loop to wait for all requests to complete
            const results: REQUETE_DATA_T[] = [];
            
            for (const element of allRequeteCartoSelected) {
                try {
                    const res = await getRequeteCarte(element.data.Nom_View);
                    if (res) {
                        results.push({
                            data: res,
                            title: element.data.intitule,
                            icon: element.icon
                        });
                    }
                } catch (error) {
                    toast.error(`Une erreur est survenue lors du chargement des ${element.data.intitule}`);
                }
            }

            setrequetesData({ requetesData: results });

        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation des elements");
        }
    }, [allRequeteCartoSelected, requetesData, setrequetesData]);

    useEffect(
        () => {
            loadListe()
        },
        [loadListe]
    )


    if (!allRequeteCartoSelected.length) {
        return <React.Fragment />;
    }

    return (
        <>
            {requetesData.map((value, index) => (
                <ElementContainer
                    data={value.data.map(element => ({ ...element, latitude: element?.LT, longitude: element?.LG }))}
                    fieldKeyListe={'*'}
                    show
                    nomListe={value?.title}
                    icon={value.icon}
                />
            ))}
        </>

    )
}

export default FicheDeDonneeElement