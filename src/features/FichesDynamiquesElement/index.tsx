
import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import ElementContainer from 'components/Cartographie/ElementContainer';
import useFicheDynamiquesStore from 'stores/ficheDynamiques/useFicheDynamiquesStore';

const FichesDynamiquesElement = () => {
    const {
        ficheDynamiquesData,
        ficheTitleSelected,
        getAllFicheData,
        elementListe,
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);

    // Create a map for quick lookup of settings by title
    const settingsByTitle = useMemo(() => {
        const map = new Map();
        ficheDynamiquesData.forEach((item: any) => {
            map.set(item.title, {
                icon: item.icon,
                iconSize: item.iconSize,
                selectedFields: item.selectedFields
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
                    selectedFields: settings.selectedFields
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
    }, [loadListe]);

    if (!getAllFicheData) {
        return <React.Fragment />;
    }

    return (
        <>
            {elementListe.map((value, index) => (
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

