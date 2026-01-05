import { Accordion, AccordionDetails, AccordionSummary, Checkbox, LinearProgress, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../providers";
import { LOADING_STATE_T } from "types";
import { getAllRegion } from "functions/API/region/getAll";
import useLocaliteStore from "stores/localite/useLocaliteStore";

const LocaliteCouche = () => {
    const {
        setlegendeSection,
    } = useContext(AppContext);
    
    const {
        data,
        localiteRegionsSelected,
        localiteDepartementsSelected,
        localiteVillagesSelected,
        localiteCommunesSelected
    } = useLocaliteStore();
    const setLocaliteData = useLocaliteStore((state) => state.set);

    const [loadingState, setloadingState] = useState<LOADING_STATE_T>(null);

    /** Charger les couches depuis l'API */
    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            getAllRegion().then((res) => res && setLocaliteData({ data: res }));
        } catch (error) {
            console.error("Erreur lors du chargement des couches", error);
        } finally {
            setloadingState(null);
        }
    };

    /** Toggle (activer/désactiver) une couche */
    const toogleElementInCoucheDonnesListe = (element: any, type: 'region' | 'departement' | 'commune' | 'village') => {
        switch (type) {
            case 'region':
                setLocaliteData({localiteRegionsSelected : localiteRegionsSelected.includes(element) 
                    ? localiteRegionsSelected.filter(item => item.code_region !== element.code_region) 
                    : [...localiteRegionsSelected, element]});
                break;

            case 'departement':
                setLocaliteData({localiteDepartementsSelected : localiteRegionsSelected.includes(element) 
                    ? localiteDepartementsSelected.filter(item => item.code_departement !== element.code_departement) 
                    : [...localiteRegionsSelected, element]});
                break;

            case 'commune':
                setLocaliteData({localiteCommunesSelected : localiteRegionsSelected.includes(element) 
                    ? localiteCommunesSelected.filter(item => item.code_commune !== element.code_commune) 
                    : [...localiteRegionsSelected, element]});
                break;

            case 'village':
                setLocaliteData({localiteVillagesSelected : localiteRegionsSelected.includes(element) 
                    ? localiteVillagesSelected.filter(item => item.nom_village !== element.nom_village) 
                    : [...localiteRegionsSelected, element]});
                break;

            default:
                break;
        }
    };


    /** Charger au montage */
    useEffect(() => {
        loadData();
    }, []);

    if (loadingState) {
        return (
            <LinearProgress />
        )
    }

    return (
        <Stack gap={1} >
            {data.map((region, index) => (
                <Accordion
                    key={index}
                    sx={{ fontSize: 12, borderRadius: 5, p: 1 }}
                    variant="soft"
                >
                    <AccordionSummary
                        children={
                            <Checkbox
                                label={region.nom_region.toLowerCase()}
                                onClick={() => toogleElementInCoucheDonnesListe(region, 'region')}
                            />
                        }
                    />

                    <AccordionDetails>
                        {region.departements.map((departement, index) => (
                            <Accordion
                                key={index}
                                sx={{ ml: 1.5, pl: 1.5, borderLeft: `1px solid grey` }}
                            >
                                <AccordionSummary
                                    children={
                                        <Checkbox
                                            label={departement.nom_departement.toLowerCase()}
                                            onClick={() => toogleElementInCoucheDonnesListe(departement, 'departement')}
                                        />
                                    }
                                />

                                <AccordionDetails >
                                    {departement.communes.map((commune, index) => (
                                        <Accordion
                                            key={index}
                                            sx={{ ml: 1.5, pl: 1.5, borderLeft: `1px solid grey` }}
                                        >
                                            <AccordionSummary
                                                children={
                                                    <Checkbox
                                                        label={commune.nom_commune.toLowerCase()}
                                                        onClick={() => toogleElementInCoucheDonnesListe(commune, 'commune')}
                                                    />
                                                }
                                            />

                                            <AccordionDetails >
                                                <Stack
                                                    key={index}
                                                    sx={{ ml: 1.5, pl: 1.5, borderLeft: `1px solid grey` }}
                                                    gap={1}
                                                >
                                                    {commune.villages.map((village, index) => (
                                                        <Checkbox
                                                            label={village.nom_village.toLowerCase()}
                                                            onClick={() => toogleElementInCoucheDonnesListe(village, 'village')}
                                                        />
                                                    ))}
                                                </Stack>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}

                                </AccordionDetails>

                            </Accordion>
                        ))}
                    </AccordionDetails>


                </Accordion>
            ))}

        </Stack>
    );
};

export default LocaliteCouche;
