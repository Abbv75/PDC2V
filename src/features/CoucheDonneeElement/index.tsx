import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import { AppContext } from 'providers';
import { useContext } from 'react';

const CoucheDonneeElement = () => {
    const { coucheDeDonneesSelectedListe, coucheDeDonneesElementConfig } = useContext(AppContext);

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={coucheDeDonneesSelectedListe}
            showName={coucheDeDonneesElementConfig.showShapefileName}
            showPopUp={coucheDeDonneesElementConfig.showShapefilePopup}
        />
    )
}

export default CoucheDonneeElement