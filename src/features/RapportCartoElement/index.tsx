import React, { useContext, useEffect, useState } from 'react';
import ElementContainer from '../../components/Cartographie/ElementContainer';
import { toast } from 'react-toastify';
import { GET_RAPORT_CARTO_T } from '../../types';
import { AppContext } from 'providers';
import { getRapportCarto } from 'functions/API';
import { green } from '@mui/material/colors';

export default () => {
    const { allRapportCartoSelected } = useContext(AppContext);
    const [requetesData, setrequetesData] = useState([] as { data: GET_RAPORT_CARTO_T, color?: string }[]);

    const loadListe = async () => {
        try {
            setrequetesData([]);

            allRapportCartoSelected?.forEach(async (element) => {
                try {
                    const res = await getRapportCarto(element.data.code);
                    res && setrequetesData(prev => [
                        ...prev, 
                        {data : res, color: element.color}
                    ]);

                } catch (error) {
                    toast.error(`Une erreur est survenue lors du chargement des ${element.data.title}`)
                }
            });

        } catch (error) {
            toast.error("Une erreur est survenue lors de la recuperation des elements");
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