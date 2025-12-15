import { Button, ButtonGroup, Checkbox, LinearProgress, Sheet, Stack } from "@mui/joy";
import { useContext, useEffect, useMemo, useState } from "react";
import { COUCHE_DE_DONNEES_LISTE, ICON } from "constant";
import { GET_ALL_REQUETE_CARTE_T, LOADING_STATE_T } from "types";
import getAllRequeteCarte from "functions/API/requeteCartographique/getAllRequeteCarte";
import { AppContext } from "providers";
import ImagePicker from "components/ImagePicker/ImagePicker";

const FicheDeDonnee = () => {
    const {
        allRequeteCartoSelected,
        setallRequeteCartoSelected,
        setlegendeSection,
        iconList,
    } = useContext(AppContext);

    const [isAllCocher, setisAllCocher] = useState(false);
    const [data, setdata] = useState([] as { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[]);
    const [loadingState, setloadingState] = useState(null as LOADING_STATE_T);

    const updateDataIcon = (index: number, icon: any) => {
        const newData = [...data];
        newData[index].icon = icon;
        setdata(newData);
    }

    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            const res = await getAllRequeteCarte();
            if (!res) return;

            setdata(res.map(value => ({
                data: value,
                icon: iconList[0]
            })));
        } finally {
            setloadingState(null);
        }
    }

    const toogleElementInSelectedListe = (element: { icon?: any, data: GET_ALL_REQUETE_CARTE_T }) => {
        let isInListe = allRequeteCartoSelected.find(({ data }) => data.Nom_View === element.data.Nom_View);

        if (!!isInListe) {
            let res: { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[] = allRequeteCartoSelected.filter(({ data }, index) => data.Nom_View != element.data.Nom_View);

            setallRequeteCartoSelected(res);
        }
        else {
            setallRequeteCartoSelected(
                (prev: typeof COUCHE_DE_DONNEES_LISTE) => [...prev, element]
            );
        }
    }

    const toutCocherHandle = () => {
        setallRequeteCartoSelected(isAllCocher ? [] : data);
        setisAllCocher(!isAllCocher);
    }

    useEffect(
        () => {
            loadData();
        },
        []
    );

    useEffect(
        () => {
            let res = data.filter((element) => allRequeteCartoSelected.find(({ data }) => data.Nom_View === element.data.Nom_View));
            setallRequeteCartoSelected(res);
        },
        [data]
    )

    useEffect(() => {
        if (allRequeteCartoSelected.length > 0) {
            const legendContent = (
                <Stack gap={0.5}>
                    {allRequeteCartoSelected.map((item, idx) => (
                        <Stack key={idx} direction="row" alignItems="center" gap={0.5}>
                            {item.icon && (
                                <img src={item.icon} alt="icon" style={{ width: 12, height: 12 }} />
                            )}
                            <span style={{ fontSize: 12 }}>{item.data.intitule}</span>
                        </Stack>
                    ))}
                </Stack>
            );

            setlegendeSection((prev: any) => ({
                ...prev,
                ficheDeDonnee: legendContent
            }));
        } else {
            setlegendeSection((prev: any) => ({
                ...prev,
                ficheDeDonnee: undefined
            }));
        }
    }, [allRequeteCartoSelected, setlegendeSection]);

    return (
        <Stack>
            <Sheet
                variant="outlined"
                sx={{
                    p: 1, borderRadius: 10, display: 'flex'
                }}
            >
                <Checkbox
                    checked={isAllCocher}
                    onChange={() => toutCocherHandle()}
                    label={"Tout cocher"}
                    overlay
                />
            </Sheet>

            <ButtonGroup
                orientation="vertical"
                sx={{
                    maxHeight: 200,
                    // overflowY: "scroll",
                    pr: 0.5,
                    mt: 1,
                    "& > *": {
                        textOverflow: "ellipsis",
                        borderColor: "white",
                    }
                }}
                variant="soft"
            >
                {loadingState && (<LinearProgress color="success" />)}

                {
                    data.map((value, index) => (
                        <Button
                            key={index}
                            variant={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "solid" : "soft"}
                            onClick={() => toogleElementInSelectedListe(value)}
                            color={allRequeteCartoSelected.find(({ data }) => data.Nom_View === value.data.Nom_View) ? "success" : "neutral"}
                            size="sm"
                            sx={{
                                fontSize: 12
                            }}
                            endDecorator={<ImagePicker
                                onchange={(icon) => updateDataIcon(index, icon)}
                            />}
                        >
                            <p style={{ width: '100%', textAlign: "left" }} >
                                {value.data.intitule}
                            </p>
                        </Button>
                    ))
                }

            </ButtonGroup>
        </Stack>
    )
}

export default FicheDeDonnee