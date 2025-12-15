import { useEffect, useState } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { urlparams } from '../../App';
import { toast } from 'react-toastify';
import { getCommune } from '../../functions/API';
import ShapeFileContainer from '../../components/Cartographie/ShapeFileContainer';
import { COMMUNE_T, SHAPE_OBJECT_T } from 'types';
import { blue, orange } from '@mui/material/colors';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';

const CurrentCommuneElement = () => {
    const [codeCommune] = useState(urlparams.get('codeCommune'));
    const [currentCommune, setcurrentCommune] = useState(undefined as COMMUNE_T | undefined);

    const loadCommune = async () => {
        try {
            if (codeCommune == null) {
                return;
            }

            const res = await getCommune(codeCommune);
            if (!res) {
                toast.error("Une erreur est survenue lors de la recuperation du commune");
                return;
            }

            setcurrentCommune(res);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation du commune");
        }
    }

    useEffect(
        () => {
            loadCommune()
        },
        [codeCommune]
    )

    if (!currentCommune) {
        return null;
    }

    return (
        <>
            <ShapeFileContainer
                coucheDeDonneesListe={[{
                    filePath: `${REACT_APP_SHAPE_FILE_URL}/${codeCommune}.zip`,
                    opacity: 0.01,
                    couleur_c: orange[700],
                    name: currentCommune.nom_commune
                }] as SHAPE_OBJECT_T[]}
            />

            <ElementContainer
                data={currentCommune.villages}
                fieldKeyListe={[
                    {
                        originaleName: 'nom_commune',
                        renamed: "Nom du commune"
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
                nomListe={`villages de ${currentCommune?.nom_commune}`}
            />
        </>
    )
}

export default CurrentCommuneElement