import { useEffect, useState } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { urlparams } from '../../App';
import { toast } from 'react-toastify';
import { getVillage } from '../../functions/API';
import { VILLAGE_T } from '../../types';

const CurrentVillageElement = () => {
    const [codeVillage] = useState(urlparams.get('codeVillage'));
    const [currentVillage, setcurrentVillage] = useState(undefined as VILLAGE_T | undefined);

    const loadVillage = async () => {
        try {
            if (codeVillage == null) {
                return;
            }

            const res = await getVillage(codeVillage);
            if (!res) {
                toast.error("Une erreur est survenue lors de la recuperation du village");
                return;
            }

            setcurrentVillage(res);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation du village");
        }
    }

    useEffect(
        () => {
            loadVillage()
        },
        [codeVillage]
    )


    if (!currentVillage) {
        return null;
    }

    return (
        <ElementContainer
            data={[currentVillage]}
            fieldKeyListe={[
                {
                    originaleName: 'nom_village',
                    renamed: "Nom du village"
                },
                {
                    originaleName: 'homme',
                    renamed: "Nombre d'homme"
                },
                {
                    originaleName: 'femme',
                    renamed: "Nombre de femme",
                },
                {
                    originaleName: "jeune",
                    renamed: "Nombre de jeune",
                },
                {
                    originaleName: "nb_menage",
                    renamed: "Nombre de menage",
                }
            ]}
            show
            nomListe={currentVillage?.nom_village}
        />
    )
}

export default CurrentVillageElement