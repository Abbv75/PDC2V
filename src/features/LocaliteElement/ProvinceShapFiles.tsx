import { blue } from '@mui/material/colors';
import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';
import useLocaliteStore from 'stores/localite/useLocaliteStore';
import { SHAPE_OBJECT_T } from 'types';

const ProvinceShapFiles = () => {
    const {localiteDepartementsSelected} = useLocaliteStore();

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={localiteDepartementsSelected.map(value => ({
                filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_departement}.zip`,
                opacity: 0.002,
                couleur_c: blue[700],
                name: value.nom_departement,
                textBgColor: blue[700],
                metaData: {
                    "Nom du département": value.nom_departement
                }
            } as SHAPE_OBJECT_T))}      
        />
    )
}

export default ProvinceShapFiles