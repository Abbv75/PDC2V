import { Box, Button, ButtonGroup, Checkbox, LinearProgress, Sheet, Stack, Typography } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { LOADING_STATE_T, RAPORT_CARTO_T } from "types";
import { AppContext } from "providers";
import { getAllRapportCarto } from "functions/API";
import { green } from "@mui/material/colors";
import ItemBtn from "./ItemBtn";

export default () => {
    const {
        allRapportCartoSelected,
        setallRapportCartoSelected,
        setlegendeSection,
    } = useContext(AppContext);

    const [isAllCocher, setisAllCocher] = useState(false);
    const [data, setdata] = useState<RAPORT_CARTO_T[]>([]);
    const [loadingState, setloadingState] = useState(null as LOADING_STATE_T);

    const loadData = async () => {
        try {
            setloadingState("En cours de chargement");
            const res = await getAllRapportCarto();
            if (!res) return;

            setdata(res);
        } finally {
            setloadingState(null);
        }
    }

    const toutCocherHandle = () => {
        setallRapportCartoSelected(isAllCocher ? [] : data.map((item) => ({ data: item, color: green[400] })));
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
            let res = data.filter((element) => allRapportCartoSelected.find(({ data }) => data.code === element.code));
            setallRapportCartoSelected(res.map((item) => ({ data: item, color: green[400] })));
        },
        [data]
    )

    useEffect(() => {
        if (allRapportCartoSelected.length > 0) {
            const legendContent = (
                <Stack gap={0.5}>
                    {/* <Typography level="h3" >Les rapports cartographiques sélectionnés:</Typography> */}
                    {allRapportCartoSelected.map((item, idx) => (
                        <Stack key={idx} direction="row" alignItems="center" gap={0.5}>
                            {item.color && <Stack width={20} height={20} borderRadius={50} bgcolor={item.color} />}
                            <span style={{ fontSize: 12 }}>{item.data.title}</span>
                        </Stack>
                    ))}
                </Stack>
            );

            setlegendeSection((prev: any) => ({
                ...prev,
                rapportCarto: legendContent
            }));
        } else {
            setlegendeSection((prev: any) => ({
                ...prev,
                rapportCarto: undefined
            }));
        }
    }, [allRapportCartoSelected, setlegendeSection]);

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
                    overflowY: "scroll",
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

                {data.map((value, index) => (
                    <ItemBtn value={value} key={index} />
                ))}

            </ButtonGroup>
        </Stack>
    )
}