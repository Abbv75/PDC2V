import { blue } from '@mui/material/colors';
import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';
import { AppContext } from 'providers';
import { useContext } from 'react';
import { SHAPE_OBJECT_T } from 'types';

const CommuneShapFiles = () => {
    const { localite, coucheDeDonneesElementConfig } = useContext(AppContext);

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={localite.commune.map(value => ({
                filePath: `${REACT_APP_SHAPE_FILE_URL}/${value.code_commune}.zip`,
                opacity: 0.002,
                couleur_c: blue[700],
                name: value.nom_commune,
                textBgColor: blue[700],
                metaData :{
                    "Nom de la commune" : value.nom_commune
                }
            } as SHAPE_OBJECT_T))}
            showName={coucheDeDonneesElementConfig.showShapefileName}
            showPopUp={coucheDeDonneesElementConfig.showShapefilePopup}
        />
    )
}

export default CommuneShapFiles