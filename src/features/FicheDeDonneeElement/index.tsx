import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import getRequeteCarte from 'functions/API/requeteCartographique/getRequeteCarte';
import useRequeteCartoStore from 'stores/requeteCarto/useRequeteCartoStore';
import ElementContainerTmp from 'components/Cartographie/ElementContainerTmp';

const FicheDeDonneeElement = () => {    
    const { allRequeteCartoSelected, requetesData } = useRequeteCartoStore();
    const setrequetesData = useRequeteCartoStore(state => state.set);

    const loadListe = async () => {
        try {
            if (!allRequeteCartoSelected.length) return;

            setrequetesData({ requetesData: [] });

            allRequeteCartoSelected.forEach(async (element) => {
                try {
                    getRequeteCarte(element.data.Nom_View).then(res => {
                        res && setrequetesData({requetesData : [
                            ...requetesData,
                            { data: res, title: element.data.intitule, icon: element.icon }
                        ]});
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
    );


    if (!allRequeteCartoSelected.length) {
        return <React.Fragment />;
    }

    return (
        <>
            {requetesData.map((value, index) => (
                <ElementContainerTmp
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