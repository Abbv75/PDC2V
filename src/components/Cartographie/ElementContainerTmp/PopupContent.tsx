import { Divider, Stack, Typography } from "@mui/joy";
import { blue } from "@mui/material/colors";
import CustomSwipper from "components/CustomSwipper";
import { isImageValue } from "helper/isImageValue";
import { Fragment, memo } from "react";
import { Popup } from "react-leaflet";
import useReglageStore from "stores/reglage/useReglageStore";

export interface PopUpDataItem {
    label: string;
    value: unknown;
}


const PopupContent = ({ popUpData }: {popUpData: PopUpDataItem[]}) => {
    const keyToHides = useReglageStore((state) => state.keyToHides);

    // Filtrer les champs masqués
    const filteredData = popUpData.filter(item => !keyToHides.includes(item.label));

    if (filteredData.length === 0) {
        return (
            <Popup>
                <Typography fontSize={11} textColor="neutral.500">
                    Aucun champ visible
                </Typography>
            </Popup>
        );
    }

    return (
        <Popup>
            <Stack gap={1} width={300} sx={{ "& *": { height: "fit-content" } }}>
                {filteredData.map((item, idx) => {
                    let valueToRender = item.value;

                    // Si c'est une seule image, transformer en tableau pour CustomSwipper
                    if (isImageValue(valueToRender)) {
                        valueToRender = [valueToRender];
                    }

                    // Si c'est un tableau d'images, afficher CustomSwipper
                    if (Array.isArray(valueToRender) && valueToRender.every(isImageValue)) {
                        return (
                            <Fragment key={idx}>
                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    textColor={blue[600]}
                                >
                                    {item.label}
                                </Typography>
                                <CustomSwipper photosListe={valueToRender as string[]} />
                                <Divider />
                            </Fragment>
                        );
                    }

                    // Sinon, afficher sous forme de ligne de tableau
                    return (
                        <Fragment key={idx}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={2}
                            >
                                <Typography
                                    fontSize={11}
                                    fontWeight={700}
                                    textColor={blue[600]}
                                    maxWidth="40%"
                                >
                                    {item.label}
                                </Typography>
                                <Typography fontSize={11} maxWidth="60%" textAlign="right">
                                    {String(valueToRender)}
                                </Typography>
                            </Stack>
                            <Divider />
                        </Fragment>
                    );
                })}
            </Stack>
        </Popup>
    );
};

export default memo(PopupContent);
