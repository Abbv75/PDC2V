import ShapeFileContainer from 'components/Cartographie/ShapeFileContainer';
import useCoucheDeDonneeStore from 'stores/coucheDeDonnee/useCoucheDeDonneeStore';
import useReglageStore from 'stores/reglage/useReglageStore';

const CoucheDonneeElement = () => {
    const { coucheDeDonneesSelectedListe } = useCoucheDeDonneeStore();

    return (
        <ShapeFileContainer
            coucheDeDonneesListe={coucheDeDonneesSelectedListe}
        />
    )
}

export default CoucheDonneeElement