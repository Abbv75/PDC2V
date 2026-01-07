import { blue } from '@mui/material/colors';
import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';
import useLocaliteStore from 'stores/localite/useLocaliteStore';
import { SHAPE_OBJECT_T } from 'types';

const CommuneShapFiles = () => {
    const {localiteCommunesSelected} = useLocaliteStore();

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={localiteCommunesSelected.map(value => ({
                filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_commune}.zip`,
                opacity: 0.002,
                couleur_c: blue[700],
                name: value.nom_commune,
                textBgColor: blue[700],
                metaData :{
                    "Nom de la commune" : value.nom_commune
                }
            } as SHAPE_OBJECT_T))}    
        />
    )
}

export default CommuneShapFiles