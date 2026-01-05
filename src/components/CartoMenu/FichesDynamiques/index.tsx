import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, LinearProgress, Radio, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { LOADING_STATE_T } from "types";
import { AppContext } from "providers";
import getAllFeuille from "functions/API/feuille/getAllFeuille";
import { ICON } from "constant";
import ImagePicker from "components/ImagePicker/ImagePicker";
import { CardMedia } from "@mui/material";
import useFicheDynamiquesStore from "stores/ficheDynamiques/useFicheDynamiquesStore";

const FichesDynamiques = () => {
    const {
        setlegendeSection,
        iconList
    } = useContext(AppContext);

    const {
        getAllFicheData,
        ficheDynamiquesData,
        ficheTitleSelected,
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);


    const [ficheTitle, setficheTitle] = useState([] as string[]);
    const [loadingState, setloadingState] = useState(null as LOADING_STATE_T);

    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            const res = await getAllFeuille();

            if (!res) return;

            const titles = Object.keys(res);
            setficheTitle(titles);

            // Initialiser les icônes par défaut
            setficheDynamiquesData({ficheDynamiquesData: titles.map(title => ({
                title,
                icon: iconList[0]
            }))});
  
            setficheDynamiquesData({ getAllFicheData: res });
        } finally {
            setloadingState(null);
        }
    }

    const toogleElementInFicheTitleSelected = (element: string) => {
        const isInList = ficheTitleSelected.includes(element);

        if (isInList) {
            setficheDynamiquesData({ficheTitleSelected: ficheTitleSelected.filter(v => v !== element)});
        } else {
            setficheDynamiquesData({ficheTitleSelected: [...ficheTitleSelected, element]});
        }
    }

    const updateIcon = (feuille: string, icon: any) => {
        setficheDynamiquesData((prev: any) =>
            prev.some((item: any) => item.feuille === feuille)
                ? prev.map((item: any) => item.feuille === feuille ? { ...item, icon } : item)
                : [...prev, { feuille, icon }]
        );
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (ficheTitleSelected.length > 0) {
            const legendContent = (
                <Stack gap={0.5}>
                    {ficheTitleSelected.map((feuille, idx) => {
                        const found = ficheDynamiquesData.find((item:any) => item.feuille === feuille);
                        return (
                            <Stack key={idx} direction="row" alignItems="center" gap={0.5}>
                                {found?.icon && (
                                    <CardMedia component="img" src={found.icon} style={{ width: 12, height: 12 }} />
                                )}
                                <span style={{ fontSize: 12 }}>{feuille}</span>
                            </Stack>
                        )
                    })}
                </Stack>
            );

            setlegendeSection((prev: any) => ({
                ...prev,
                ficheDynamique: legendContent
            }));
        } else {
            setlegendeSection((prev: any) => ({
                ...prev,
                ficheDynamique: undefined
            }));
        }
    }, [ficheTitleSelected, ficheDynamiquesData, setlegendeSection]);

    return (
        <Stack gap={1} pr={0.5} >
            {loadingState && (<LinearProgress color="success" />)}

            <AccordionGroup sx={{ gap: 1 }} >
                {ficheTitle.map((title, index) => (
                    <Accordion
                        key={index}
                        sx={{ fontSize: 12, borderRadius: 10 }}
                        variant="soft"
                    >
                        <AccordionSummary sx={{ fontWeight: 600 }}>
                            {title}
                        </AccordionSummary>

                        <AccordionDetails>
                            <Stack
                                sx={{
                                    pr: 0.5,
                                    mt: 1,
                                    "& > *": {
                                        textOverflow: "ellipsis",
                                        borderColor: "white",
                                    }
                                }}
                                gap={1}
                            >
                                {getAllFicheData && getAllFicheData[title]?.map((value, idx) => (
                                    <Stack
                                        key={idx}
                                        direction={"row"}
                                        justifyContent={"space-between"}
                                        alignItems="center"
                                    >
                                        <Radio
                                            value={value.feuille.Libelle_Feuille}
                                            label={value.feuille.Libelle_Feuille}
                                            sx={{ fontSize: 10 }}
                                            checked={ficheTitleSelected.includes(value.feuille.Libelle_Feuille)}
                                            onClick={() => toogleElementInFicheTitleSelected(value.feuille.Libelle_Feuille)}
                                        />
                                        <ImagePicker
                                            onchange={(icon) => updateIcon(value.feuille.Libelle_Feuille, icon)}
                                        />
                                    </Stack>
                                ))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </AccordionGroup>
        </Stack >
    )
}

export default FichesDynamiques;
