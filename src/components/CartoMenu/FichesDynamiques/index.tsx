
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, LinearProgress, Stack } from "@mui/joy";
import { useContext, useEffect } from "react";
import { AppContext } from "providers";
import getAllFeuille from "functions/API/feuille/getAllFeuille";
import { CardMedia } from "@mui/material";
import useFicheDynamiquesStore from "stores/ficheDynamiques/useFicheDynamiquesStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";
import Item from "./Item";
import ImagePicker2 from "components/ImagePicker2";

const FichesDynamiques = () => {
    const {
        setlegendeSection,
    } = useContext(AppContext);
    
    const { iconList } = useIconMapStore();

    const {
        getAllFicheData,
        ficheDynamiquesData,
        ficheTitleSelected,
        ficheTitle,
        loadingState,
    } = useFicheDynamiquesStore();
    const setficheDynamiquesData = useFicheDynamiquesStore((state) => state.set);

    const loadData = async () => {
        try {
            setficheDynamiquesData({loadingState: "En cours de chargement"});

            const res = await getAllFeuille();

            if (!res) return;

            const titles = Object.keys(res);
            
            // Merge with existing settings if item already exists
            setficheDynamiquesData((state) => {
                const existingByTitle = new Map(state.ficheDynamiquesData.map(item => [item.title, item]));
                
                const newData = titles.map(title => {
                    const existing = existingByTitle.get(title);
                    if (existing) {
                        // Preserve existing settings
                        return existing;
                    }
                    // New item with defaults
                    return {
                        title,
                        icon: iconList[0],
                        iconSize: 40,
                        selectedFields: []
                    };
                });
                
                return { 
                    ficheTitle: titles,
                    ficheDynamiquesData: newData
                };
            });
  
            setficheDynamiquesData({ getAllFicheData: res });
        } finally {
            setficheDynamiquesData({loadingState: null});
        }
    }

    useEffect(() => {
        !ficheTitle.length && loadData();
    }, []);

    useEffect(() => {
        if (ficheTitleSelected.length > 0) {
            const legendContent = (
                <Stack gap={0.5}>
                    {ficheTitleSelected.map((feuille, idx) => {
                        const found = ficheDynamiquesData.find((item:any) => item.title === feuille);
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
                                    <Item value={value} key={idx}/>
                                ))}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </AccordionGroup>

            {/* ImagePicker2 component for icon selection */}
            <ImagePicker2 />
        </Stack >
    )
}

export default FichesDynamiques;

