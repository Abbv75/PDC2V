import { Button, ButtonGroup, Checkbox, LinearProgress, Sheet, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { GET_ALL_REQUETE_CARTE_T, LOADING_STATE_T } from "types";
import getAllRequeteCarte from "functions/API/requeteCartographique/getAllRequeteCarte";
import { AppContext } from "providers";
import ImagePicker from "components/ImagePicker/ImagePicker";
import ImagePicker2 from "components/ImagePicker2";
import useRequeteCartoStore from "stores/requeteCarto/useRequeteCartoStore";
import useIconMapStore from "stores/iconMap/useIconMapStore";
import Item from "./FicheDeDonneeItem";

const FicheDeDonnee = () => {
    const {
        setlegendeSection,
    } = useContext(AppContext);
    const { iconList } = useIconMapStore();

    const {
        allRequeteCartoSelected,
        data: storeData
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [isAllCocher, setisAllCocher] = useState(false);
    const [loadingState, setloadingState] = useState(null as LOADING_STATE_T);

    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            const res = await getAllRequeteCarte();
            if (!res) return;

            // Merge with existing settings if item already exists
            setRequeteCartoData((state) => {
                const existingByNomView = new Map(state.data.map(item => [item.data.Nom_View, item]));
                
                const newData = res.map(value => {
                    const existing = existingByNomView.get(value.Nom_View);
                    if (existing) {
                        // Preserve existing settings
                        return existing;
                    }
                    // New item with defaults
                    return {
                        data: value,
                        icon: iconList[0],
                        iconSize: 40,
                        selectedFields: []
                    };
                });
                
                return { data: newData };
            });

        } finally {
            setloadingState(null);
        }
    }

    const toutCocherHandle = () => {
        setRequeteCartoData({ allRequeteCartoSelected: isAllCocher ? [] : storeData });
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
            let res = storeData.filter((element) => allRequeteCartoSelected.find(({ data }) => data.Nom_View === element.data.Nom_View));
            setRequeteCartoData({ allRequeteCartoSelected: res });
        },
        [storeData]
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
                    storeData.map((value, index) => (
                        <Item index={index} value={value} key={value.data.Nom_View} />
                    ))
                }

            </ButtonGroup>

            {/* ImagePicker2 component for icon selection */}
            <ImagePicker2 />
        </Stack>
    )
}

export default FicheDeDonnee;

