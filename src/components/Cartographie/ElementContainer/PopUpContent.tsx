import { Divider, Stack, Typography } from "@mui/joy";
import { blue } from "@mui/material/colors";
import { Fragment } from "react";
import { Popup } from "react-leaflet";

export interface PopUpDataItem {
    label: string;
    value: any;
}

interface PopUpContentProps {
    popUpData: PopUpDataItem[];
    selectedFields?: string[];
}

const PopUpContent = ({ popUpData, selectedFields }: PopUpContentProps) => {
    // Filter popUpData based on selectedFields if provided
    const filteredPopUpData = selectedFields && selectedFields.length > 0
        ? popUpData.filter(item => selectedFields.includes(item.label))
        : popUpData;

    return (
        <Popup>
            <Stack
                gap={1}
                sx={{
                    "& *": {
                        height: "fit-content",
                    },
                    maxHeight: 250,
                    overflowY: "scroll"
                }}
                width={300}
            >
                {filteredPopUpData.map((item, idx) => (
                    <Fragment key={idx}>
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            gap={3}
                        >
                            <Typography
                                maxWidth={"75%"}
                                textColor={blue[600]}
                                fontSize={11}
                                fontWeight={700}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                textAlign={"right"}
                                minWidth={"25%"}
                                fontSize={11}
                            >
                                {item.value}
                            </Typography>
                        </Stack>
                        <Divider />
                    </Fragment>
                ))}
            </Stack>
        </Popup>
    );
};

export default PopUpContent;

