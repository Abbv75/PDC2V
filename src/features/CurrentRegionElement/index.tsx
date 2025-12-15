import { useContext, useEffect, useState } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { urlparams } from '../../App';
import { toast } from 'react-toastify';
import { getRegion } from '../../functions/API';
import ShapeFileContainer from '../../components/Cartographie/ShapeFileContainer';
import { REGION_T, SHAPE_OBJECT_T } from 'types';
import { blue, orange, red } from '@mui/material/colors';
import { AppContext } from 'providers';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';

const CurrentRegionElement = () => {
    const [codeRegion] = useState(urlparams.get('codeRegion'));

    const { zoomLevel } = useContext(AppContext);

    const [currentRegion, setcurrentRegion] = useState(undefined as REGION_T | undefined);

    const loadRegion = async () => {
        try {
            if (codeRegion == null) {
                return;
            }

            const res = await getRegion(codeRegion);
            if (!res) {
                toast.error("Une erreur est survenue lors de la recuperation du region");
                return;
            }

            setcurrentRegion(res);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation du region");
        }
    }

    useEffect(
        () => {
            loadRegion()
        },
        [codeRegion]
    )

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <ShapeFileContainer
                coucheDeDonneesListe={[{
                    filePath: `${REACT_APP_SHAPE_FILE_URL}/${codeRegion}.zip`,
                    opacity: 0.001,
                    couleur_c: red[700],
                    name: currentRegion.nom_region
                }] as SHAPE_OBJECT_T[]}
            />

            <ShapeFileContainer
                coucheDeDonneesListe={zoomLevel > 7
                    ? currentRegion.departements.map(value => ({
                        filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_departement}.zip`,
                        opacity: 0.001,
                        couleur_c: blue[700],
                        name: value.nom_departement
                    }) as SHAPE_OBJECT_T)
                    : []
                }
            />

            <ShapeFileContainer
                coucheDeDonneesListe={zoomLevel > 8
                    ? currentRegion.communes.map(value => ({
                        filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_commune}.zip`,
                        opacity: 0.001,
                        couleur_c: orange[700],
                        name: value.nom_commune
                    }) as SHAPE_OBJECT_T)
                    : []
                }
            />

            <ElementContainer
                data={currentRegion.villages}
                fieldKeyListe={[
                    {
                        originaleName: 'nom_region',
                        renamed: "Nom du region"
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
                show={zoomLevel > 9}
                nomListe={`villages de ${currentRegion?.nom_region}`}
            />
        </>
    )
}

export default CurrentRegionElement