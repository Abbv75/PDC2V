import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { AppContext } from 'providers';
import { useContext } from 'react';
import useCoucheDeDonneeStore from 'stores/coucheDeDonnee/useCoucheDeDonneeStore';

const CoucheDonneeElement = () => {
    const { coucheDeDonneesElementConfig } = useContext(AppContext);

    const {coucheDeDonneesSelectedListe} = useCoucheDeDonneeStore();

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={coucheDeDonneesSelectedListe}
            showName={coucheDeDonneesElementConfig.showShapefileName}
            showPopUp={coucheDeDonneesElementConfig.showShapefilePopup}
        />
    )
}

export default CoucheDonneeElement