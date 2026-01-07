import { Divider, Stack, Typography } from "@mui/joy";
import { blue } from "@mui/material/colors";
import { Fragment, memo } from "react";
import { Popup } from "react-leaflet";
import useReglageStore from "stores/reglage/useReglageStore";

export interface PopUpDataItem {
    label: string;
    value: unknown;
}

interface PopupContentProps {
    popUpData: PopUpDataItem[];
}

const PopupContent = ({ popUpData }: PopupContentProps) => {
    const keyToHides = useReglageStore((state) => state.keyToHides);

    const filteredData = popUpData.filter(
        (item) => !keyToHides.includes(item.label)
    );

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
            <Stack
                gap={1}
                sx={{ "& *": { height: "fit-content" } }}
                width={300}
            >
                {filteredData.map((item, idx) => (
                    <Fragment key={idx}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={3}
                        >
                            <Typography
                                maxWidth="75%"
                                textColor={blue[600]}
                                fontSize={11}
                                fontWeight={700}
                            >
                                {item.label}
                            </Typography>

                            <Typography
                                textAlign="right"
                                minWidth="25%"
                                fontSize={11}
                            >
                                {String(item.value)}
                            </Typography>
                        </Stack>
                        <Divider />
                    </Fragment>
                ))}
            </Stack>
        </Popup>
    );
};

export default memo(PopupContent);
