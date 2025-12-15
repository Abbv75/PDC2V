import { useContext, useEffect, useState } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { urlparams } from '../../App';
import { toast } from 'react-toastify';
import { getProvince } from '../../functions/API';
import ShapeFileContainer from '../../components/Cartographie/ShapeFileContainer';
import { PROVINCE_T, SHAPE_OBJECT_T } from 'types';
import { blue, orange } from '@mui/material/colors';
import { AppContext } from 'providers';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';

const CurrentProvinceElement = () => {
    const [codeProvince] = useState(urlparams.get('codeDepartement'));

    const { zoomLevel } = useContext(AppContext);

    const [currentProvince, setcurrentProvince] = useState(undefined as PROVINCE_T | undefined);

    const loadProvince = async () => {
        try {
            if (codeProvince == null) {
                return;
            }

            const res = await getProvince(codeProvince);
            if (!res) {
                toast.error("Une erreur est survenue lors de la recuperation du commune");
                return;
            }

            setcurrentProvince(res);
        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation du commune");
        }
    }

    useEffect(
        () => {
            loadProvince()
        },
        [codeProvince]
    )

    if (!currentProvince) {
        return null;
    }

    return (
        <>
            <ShapeFileContainer
                coucheDeDonneesListe={[{
                    filePath: `${REACT_APP_SHAPE_FILE_URL}/${codeProvince}.zip`,
                    opacity: 0.001,
                    couleur_c: blue[700],
                    name: currentProvince.nom_departement
                }] as SHAPE_OBJECT_T[]}
            />

            <ShapeFileContainer
                coucheDeDonneesListe={zoomLevel > 7
                    ? currentProvince.communes.map(value => ({
                        filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_commune}.zip`,
                        opacity: 0.001,
                        couleur_c: orange[700],
                        name: value.nom_commune
                    }) as SHAPE_OBJECT_T)
                    : []
                }
            />

            <ElementContainer
                data={currentProvince.villages}
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
                show={zoomLevel > 8}
                nomListe={`villages de ${currentProvince?.nom_departement}`}
            />
        </>
    )
}

export default CurrentProvinceElement