import React, { useEffect, useRef, useCallback } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { toast } from 'react-toastify';
import { GET_REQUETE_CARTE_T, REQUETE_DATA_T } from '../../types';
import getRequeteCarte from 'functions/API/requeteCartographique/getRequeteCarte';
import useRequeteCartoStore from 'stores/requeteCarto/useRequeteCartoStore';

const FicheDeDonneeElement = () => {    
    const { allRequeteCartoSelected, requetesData, requetesDataCache, set } = useRequeteCartoStore();
    const setrequetesData = useRequeteCartoStore(state => state.set);
    
    // Track previous selected items to avoid unnecessary reloads
    const prevSelectedRef = useRef<string[]>([]);

    const loadListe = useCallback(async () => {
        // Get current selected item IDs
        const currentIds = allRequeteCartoSelected.map(item => item.data.Nom_View);
        const prevIds = prevSelectedRef.current;

        // Check if the actual items changed (not just icons, sizes, or selectedFields)
        const itemsChanged = 
            currentIds.length !== prevIds.length ||
            currentIds.some(id => !prevIds.includes(id));

        // Update ref for next comparison
        prevSelectedRef.current = currentIds;

        // Only reload if items actually changed or if no data exists
        if (!itemsChanged && requetesData.length > 0) {
            // Just update props in existing data without reloading
            const updatedData = requetesData.map((reqData, idx) => {
                const matchingItem = allRequeteCartoSelected[idx];
                if (matchingItem) {
                    let needsUpdate = false;
                    let updated = { ...reqData };
                    
                    if (matchingItem.icon !== reqData.icon) {
                        updated.icon = matchingItem.icon;
                        needsUpdate = true;
                    }
                    if (matchingItem.iconSize !== reqData.iconSize) {
                        updated.iconSize = matchingItem.iconSize;
                        needsUpdate = true;
                    }
                    if (JSON.stringify(matchingItem.selectedFields) !== JSON.stringify(reqData.selectedFields)) {
                        updated.selectedFields = matchingItem.selectedFields;
                        needsUpdate = true;
                    }
                    
                    return needsUpdate ? updated : reqData;
                }
                return reqData;
            });
            
            // Only update if props actually changed
            const propsChanged = updatedData.some((item, idx) => {
                const orig = requetesData[idx];
                return item.icon !== orig?.icon || 
                       item.iconSize !== orig?.iconSize ||
                       JSON.stringify(item.selectedFields) !== JSON.stringify(orig?.selectedFields);
            });
            if (propsChanged) {
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

            // Build results - use cache when available, fetch when not
            const results: REQUETE_DATA_T[] = [];
            const newCacheEntries: { [Nom_View: string]: GET_REQUETE_CARTE_T[] } = {};
            
            for (const element of allRequeteCartoSelected) {
                const nomView = element.data.Nom_View;
                
                // Check if we have cached data for this Nom_View
                let cachedData = requetesDataCache[nomView];
                
                if (cachedData) {
                    // Use cached data
                    results.push({
                        data: cachedData,
                        title: element.data.intitule,
                        icon: element.icon,
                        iconSize: element.iconSize,
                        selectedFields: element.selectedFields
                    });
                } else {
                    // Check if data is already in requetesData (from a previous load before being unselected)
                    const existingEntry = requetesData.find(r => r.title === element.data.intitule);
                    if (existingEntry) {
                        // Use existing data and add to cache
                        results.push({
                            data: existingEntry.data,
                            title: element.data.intitule,
                            icon: element.icon,
                            iconSize: element.iconSize,
                            selectedFields: element.selectedFields
                        });
                        newCacheEntries[nomView] = existingEntry.data;
                    } else {
                        // Need to fetch from API
                        try {
                            const res = await getRequeteCarte(nomView);
                            if (res) {
                                results.push({
                                    data: res,
                                    title: element.data.intitule,
                                    icon: element.icon,
                                    iconSize: element.iconSize,
                                    selectedFields: element.selectedFields
                                });
                                // Cache the fetched data
                                newCacheEntries[nomView] = res;
                            }
                        } catch (error) {
                            toast.error(`Une erreur est survenue lors du chargement des ${element.data.intitule}`);
                        }
                    }
                }
            }

            // Update store with results and cache
            if (Object.keys(newCacheEntries).length > 0) {
                set((state) => ({
                    requetesData: results,
                    requetesDataCache: { ...state.requetesDataCache, ...newCacheEntries }
                }));
            } else {
                setrequetesData({ requetesData: results });
            }

        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation des elements");
        }
    }, [allRequeteCartoSelected, requetesData, requetesDataCache, set, setrequetesData]);

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
                    iconSize={value.iconSize}
                    selectedFields={value.selectedFields}
                />
            ))}
        </>
    )
}

export default FicheDeDonneeElement;

