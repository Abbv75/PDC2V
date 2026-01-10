import React, { useEffect, useState } from 'react';
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

    const loadListe = async () => {
        try {
            if (!allRequeteCartoSelected.length) return;

            // Clear existing data first
            setrequetesData({ requetesData: [] });

            allRequeteCartoSelected.forEach(async (element) => {
                try {
                    getRequeteCarte(element.data.Nom_View).then(res => {
                        if (res) {
                            // Use functional update to avoid stale closure
                            setrequetesData((prevState) => ({
                                requetesData: [
                                    ...prevState.requetesData,
                                    { data: res, title: element.data.intitule, icon: element.icon }
                                ]
                            }));
                        }
                    });
                } catch (error) {
                    toast.error(`Une erreur est survenue lors du chargement des ${element.data.intitule}`)
                }
            });

        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation des elements");
        }
    }

    useEffect(
        () => {
            loadListe()
        },
        [allRequeteCartoSelected]
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