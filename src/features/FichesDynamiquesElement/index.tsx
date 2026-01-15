
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { green } from '@mui/material/colors';
import ElementContainer from 'components/Cartographie/ElementContainer';
import useFicheDynamiquesStore from 'stores/ficheDynamiques/useFicheDynamiquesStore';
import useMapStore from 'stores/map/useMapStore';
import aggregerParRegion from 'helper/aggregerParRegion';
import aggregerParDepartement from 'helper/aggregerParDepartement';

const FichesDynamiquesElement = () => {
    const { zoomLevel } = useMapStore();
    
    const {
        ficheDynamiquesData,
        ficheTitleSelected,
        getAllFicheData,
        elementListe,
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);

    // Track previous ficheDynamiquesData to detect changes
    const prevFicheDynamiquesDataRef = useRef<string>('');

    // Create a map for quick lookup of settings by title
    const settingsByTitle = useMemo(() => {
        const map = new Map();
        ficheDynamiquesData.forEach((item: any) => {
            map.set(item.title, {
                icon: item.icon,
                iconSize: item.iconSize,
                selectedFields: item.selectedFields,
                markerTextFont: item.markerTextFont
            });
        });
        return map;
    }, [ficheDynamiquesData]);

    const restructureData = useMemo(() => {
        try {
            if (!ficheTitleSelected.length || !getAllFicheData) return [];

            let dataRestructured: typeof getAllFicheData[0][0][] = [];

            Object.values(getAllFicheData).forEach(value => {
                value.forEach(element => {
                    dataRestructured.push(element);
                });
            });

            return dataRestructured;
        }
        catch {
            return [];
        }
    }, [ficheTitleSelected, getAllFicheData]);

    const loadListe = useCallback(() => {
        try {
            // Clear the list first to avoid stale data
            setficheDynamiquesData({elementListe: []});            

            if (!ficheTitleSelected.length || !getAllFicheData) return;

            // Build new element list based on selected titles
            const newElementListe: typeof elementListe = [];

            ficheTitleSelected.forEach(title => {
                const fiche = restructureData.find(({ feuille }) => feuille.Libelle_Feuille == title);

                if (!fiche) return;

                let keyList = Object.keys(fiche?.data[0] || {});
                let dataToPush: any[] = [];

                fiche?.data.forEach(element => {
                    let objectFinal: any = {};
                    keyList.forEach((key, index) => {
                        let keyName = fiche.lignes.find(({ Nom_Collone }) => Nom_Collone == key)?.Libelle_Ligne || key;
                        objectFinal[keyName] = element[key];
                    });
                    dataToPush.push(objectFinal);
                });

                // Get settings from store
                const settings = settingsByTitle.get(title) || {};
                
                newElementListe.push({
                    title,
                    data: dataToPush,
                    icon: settings.icon,
                    iconSize: settings.iconSize,
                    selectedFields: settings.selectedFields,
                    markerTextFont: settings.markerTextFont
                });
            });

            // Update store once with all elements
            setficheDynamiquesData({ elementListe: newElementListe });
        } catch (error) {
            toast.error("Une erreur est survenue lors du traitement");
        }
    }, [ficheTitleSelected, getAllFicheData, settingsByTitle, restructureData]);


    useEffect(() => {
        loadListe();
    }, [loadListe, zoomLevel]);

    // Update elementListe when ficheDynamiquesData changes (for font config updates)
    useEffect(() => {
        const currentDataString = JSON.stringify(ficheDynamiquesData);
        
        if (prevFicheDynamiquesDataRef.current !== currentDataString && prevFicheDynamiquesDataRef.current !== '') {
            // Data has changed, reload
            loadListe();
        }
        
        // Update the ref
        prevFicheDynamiquesDataRef.current = currentDataString;
    }, [ficheDynamiquesData, loadListe]);

    if (!getAllFicheData) {
        return <React.Fragment />;
    }

    return (
        <>
            {zoomLevel < 9 && elementListe.map((value, index) => (
                <ElementContainer
                    key={index}
                    data={aggregerParRegion(value.data as any, 'Département')
                        .filter(({ count }) => count > 0)
                        .map(
                            element => ({
                                ...element,
                                latitude: element.centroid.lat,
                                longitude: element.centroid.lng
                            })
                        )}
                    fieldKeyListe={[
                        {
                            originaleName: 'name',
                            renamed: 'Région'
                        },
                        {
                            originaleName: 'count',
                            renamed: `Nombre d'éléments`
                        }
                    ]}
                    markerText={{
                        field: `Nombre d'éléments`,
                        color: value.markerTextFont?.bgColor || green[700],
                        fontSize: value.markerTextFont?.fontSize || 'normal',
                        fontWeight: value.markerTextFont?.fontWeight || 'normal',
                        fontFamily: value.markerTextFont?.fontFamily || 'Arial',
                        fontColor: value.markerTextFont?.fontColor || '#000000'
                    }}
                    show
                    icon={value?.icon}
                    iconSize={value?.iconSize}
                />
            ))}

            {zoomLevel >= 9 && zoomLevel < 12 && elementListe.map((value, index) => (
                <ElementContainer
                    key={index}
                    data={aggregerParDepartement(value.data as any, 'Département')
                        .filter(({ count }) => count > 0)
                        .map(
                            element => ({
                                ...element,
                                latitude: element.centroid.lat,
                                longitude: element.centroid.lng
                            })
                        )}
                    fieldKeyListe={[
                        {
                            originaleName: 'name',
                            renamed: 'Département'
                        },
                        {
                            originaleName: 'count',
                            renamed: `Nombre d'éléments`
                        }
                    ]}
                    markerText={{
                        field: `Nombre d'éléments`,
                        color: value.markerTextFont?.bgColor || green[700],
                        fontSize: value.markerTextFont?.fontSize || 'normal',
                        fontWeight: value.markerTextFont?.fontWeight || 'normal',
                        fontFamily: value.markerTextFont?.fontFamily || 'Arial',
                        fontColor: value.markerTextFont?.fontColor || '#000000'
                    }}
                    show
                    icon={value?.icon}
                    iconSize={value?.iconSize}
                />
            ))}

            {zoomLevel >= 12 && elementListe.map((value, index) => (
                <ElementContainer
                    key={index}
                    data={value.data.map(element => ({ ...element, latitude: element?.LT, longitude: element?.LG }))}
                    fieldKeyListe={'*'}
                    show
                    nomListe={value?.title}
                    icon={value?.icon}
                    iconSize={value?.iconSize}
                    selectedFields={value?.selectedFields}
                />
            ))}
        </>
    )
}

export default FichesDynamiquesElement;

