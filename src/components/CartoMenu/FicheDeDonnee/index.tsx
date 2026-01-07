import { Button, ButtonGroup, Checkbox, LinearProgress, Sheet, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { GET_ALL_REQUETE_CARTE_T, LOADING_STATE_T } from "types";
import getAllRequeteCarte from "functions/API/requeteCartographique/getAllRequeteCarte";
import { AppContext } from "providers";
import ImagePicker from "components/ImagePicker/ImagePicker";
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
        data
    } = useRequeteCartoStore();
    const setRequeteCartoData = useRequeteCartoStore(state => state.set);

    const [isAllCocher, setisAllCocher] = useState(false);
    const [loadingState, setloadingState] = useState(null as LOADING_STATE_T);

    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            const res = await getAllRequeteCarte();
            if (!res) return;

            setRequeteCartoData({
                data: res.map(value => ({
                    data: value,
                    icon: iconList[0]
                }))
            })

        } finally {
            setloadingState(null);
        }
    }

    const toutCocherHandle = () => {
        setRequeteCartoData({ allRequeteCartoSelected: isAllCocher ? [] : data });
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
            setRequeteCartoData({ allRequeteCartoSelected: res });
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
                        <Item index={index} value={value} key={index} />
                    ))
                }

            </ButtonGroup>
        </Stack>
    )
}

export default FicheDeDonnee