import ElementContainer from 'components/Cartographie/ElementContainer';
import { ICON } from 'constant';
import { AppContext } from 'providers';
import { useContext } from 'react';

const VillagePoints = () => {
    const { localite } = useContext(AppContext);

    return (
        <ElementContainer
            data={localite.village}
            nomListe={'La liste des villages'}
            fieldKeyListe={[
                {
                    originaleName: 'nom_village',
                    renamed: "Nom du village"
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
            show={true}
            icon={ICON.location1}
        />
    )
}

export default VillagePoints