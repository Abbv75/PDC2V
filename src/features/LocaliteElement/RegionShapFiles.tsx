import { blue } from '@mui/material/colors';
import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { REACT_APP_SHAPE_FILE_URL } from 'constant';
import useCoucheDeDonneeStore from 'stores/coucheDeDonnee/useCoucheDeDonneeStore';
import useLocaliteStore from 'stores/localite/useLocaliteStore';
import { SHAPE_OBJECT_T } from 'types';

const RegionShapFiles = () => {
    const { coucheDeDonneesElementConfig } = useCoucheDeDonneeStore();
    const {localiteRegionsSelected} = useLocaliteStore();

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={localiteRegionsSelected.map(value => ({
                filePath: `${REACT_APP_SHAPE_FILE_URL}/localites/${value.code_region}.zip`,
                opacity: 0.002,
                couleur_c: value.couleur ?? blue[700],
                name: value.nom_region,
                couleur: blue[700],
                textBgColor: blue[700],
                fontSize : 12,
                metaData: {
                    "Nom de la région": value.nom_region
                }
            } as SHAPE_OBJECT_T ))}
            showName={coucheDeDonneesElementConfig.showShapefileName}
            showPopUp={coucheDeDonneesElementConfig.showShapefilePopup}
        />
    )
}

export default RegionShapFiles