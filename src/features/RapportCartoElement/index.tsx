import React, { useEffect } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { toast } from 'react-toastify';
import { getRapportCarto } from 'functions/API';
import useRapportCartoStore from 'stores/rapportCarto/useRapportCartoStore';

export default () => {
    const { allRapportCartoSelected, requetesData } = useRapportCartoStore();
    const setRapportCartoData = useRapportCartoStore(state => state.set);

    const loadListe = async () => {
        try {
            setRapportCartoData({ requetesData: [] });

            allRapportCartoSelected?.forEach(async (element) => {
                try {
                    getRapportCarto(element.data.code).then(res => {
                        if (res) {
                            setRapportCartoData(prev => ({
                                requetesData: [
                                    ...prev.requetesData,
                                    { data: res, color: element.color }
                                ]
                            }));
                        }
                    });
                } catch (error) {
                    toast.error(`Une erreur est survenue lors du chargement des ${element.data.title}`)
                }
            });

        } catch (error) {
            // toast.error("Une erreur est survenue lors de la recuperation des elements");
        }
    }

    useEffect(
        () => {
            loadListe()
        },
        [allRapportCartoSelected]
    )


    if (!allRapportCartoSelected.length) {
        return <React.Fragment />;
    }

    return (
        <>
            {requetesData.map((value, index) => (
                <ElementContainer
                    data={value.data.rows.map((element) => (
                        {
                            ...element,
                            latitude: element?.LT,
                            longitude: element?.LG,
                            textIcon: {
                                text: Object.keys(element).at(-1)
                            }
                        }
                    ))}
                    fieldKeyListe={[
                        {
                            originaleName: 'Village',
                            renamed: 'Village'
                        }, {
                            originaleName: 'Superficie cible études (ha)',
                            renamed: 'Superficie cible études (ha)'
                        }
                    ]}
                    markerText={{
                        field: 'Superficie cible études (ha)',
                        color: value.color
                    }}
                    show
                    nomListe={value?.data.title}
                    key={index}
                />
            ))}
        </>

    )
}