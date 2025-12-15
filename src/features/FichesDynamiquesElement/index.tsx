import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { GET_REQUETE_CARTE_T } from '../../types';
import { AppContext } from 'providers';
import ElementContainer from 'components/Cartographie/ElementContainer';

interface REQUETE_DATA_T {
    title?: string,
    data: GET_REQUETE_CARTE_T[],
    icon?: any
}

const FichesDynamiquesElement = () => {
    const { ficheTitleSelected, getAllFicheData, ficheDynamiquesData } = useContext(AppContext);
    const [elementListe, setelementListe] = useState([] as REQUETE_DATA_T[]);

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
            setelementListe([]);

            if (!ficheTitleSelected.length || !getAllFicheData) return;

            ficheTitleSelected.forEach(title => {
                const fiche = restructureData.find(({ feuille }) => feuille.Libelle_Feuille == title);

                if (!fiche) return;

                let keyList = Object.keys(fiche?.data[0] || []);
                let dataToPush: any[] = [];

                fiche?.data.forEach(element => {
                    let objectFinal: any = {};
                    keyList.forEach((key, index) => {
                        let keyName = fiche.lignes.find(({ Nom_Collone }) => Nom_Collone == key)?.Libelle_Ligne || key;
                        objectFinal[keyName] = element[key];
                    });
                    dataToPush.push(objectFinal);
                });

                // 🟢 Chercher l'icône associée
                const foundIcon = ficheDynamiquesData.find((item: any) => item.feuille === title)?.icon;

                setelementListe(prev => [
                    ...prev,
                    {
                        title,
                        data: dataToPush,
                        icon: foundIcon
                    }
                ]);
            })
        } catch (error) {
            toast.error("Une erreur est survenue lors du traitement");
        }
    }, [restructureData, ficheDynamiquesData, ficheTitleSelected, getAllFicheData]);


    useEffect(() => {
        loadListe();
    }, [ficheTitleSelected, getAllFicheData, ficheDynamiquesData]);

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
                />
            ))}
        </>
    )
}

export default FichesDynamiquesElement;
