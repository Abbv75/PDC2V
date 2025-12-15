import { Divider, Stack, Typography } from "@mui/joy";
import { blue, green } from "@mui/material/colors";
import { ICON } from "constant";
import { getCustomeIcon } from "helper/getCustomeIcon";
import { getCustomeTextIcon } from "helper/getCustomeTextIcon";
import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { toast } from "react-toastify";

// Définition des types pour les données traitées par le worker
interface PopUpDataItem {
    label: string;
    value: any;
}

export interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

const ElementContainer = ({
    data,
    fieldKeyListe,
    show = true,
    nomListe,
    icon = ICON.location1,
    markerText
}: {
    data: { [key: string]: any, longitude?: number | string, latitude?: number | string }[],
    fieldKeyListe: { originaleName: string, renamed?: string }[] | '*',
    show: boolean,
    nomListe?: string,
    icon?: string,
    markerText?: {
        field: string,
        color?: string
    }
}) => {
    const [processedPoints, setProcessedPoints] = useState<ProcessedPoint[]>([]);
    const workerRef = useRef<Worker | null>(null);

    const cleanWorker = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }

    const loadPoint = async () => {
        try {
            // toast.info(`Compilation des ${nomListe}`);

            cleanWorker()

            const worker = new Worker(new URL('../../workers/ElementContainerWorker.ts', import.meta.url));
            workerRef.current = worker;

            worker.postMessage({ data, fieldKeyListe });

            worker.onmessage = (event) => {
                const newPointsChunk: ProcessedPoint[] = event.data;
                console.log('La liste des points recu par le worker:', newPointsChunk);
                setProcessedPoints(prevPoints => [...prevPoints, ...newPointsChunk]);
            };

            worker.onerror = (error) => {
                console.error("Worker error:", error);
                toast.error("Erreur lors du traitement des données par le worker.");
            };
        } catch (error) {
            toast.error('Une erreur est survenue lors de la compilation');
        }
    }

    useEffect(() => {
        if (show) {
            setProcessedPoints([]);
            loadPoint();

            return () => {
                cleanWorker()
            };
        } else {
            // Si show est false, vider les points et terminer le worker
            setProcessedPoints([]);
            cleanWorker();
        }
    }, [data, show, icon]);

    const renderPopupContent = useCallback((popUpData: PopUpDataItem[]) => (
        <Popup>
            <Stack
                gap={1}
                sx={{
                    "& *": {
                        height: "fit-content"
                    }
                }}
                width={300}
            >
                {popUpData.map((item, idx) => (
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
    ), []);


    useEffect(() => {
        console.log('====================================');
        console.log(processedPoints);
        console.log('====================================');
    }, [processedPoints])

    if (!show) {
        return <></>;
    }

    console.log('Rendering ElementContainer. Current processedPoints count:', processedPoints.length);


    return (
        <>
            {/* Afficher les marqueurs au fur et à mesure qu'ils sont traités */}
            {processedPoints.map((value, index) => (
                <Marker
                    position={value.coor as any}
                    key={index}
                    icon={
                        markerText
                            ? getCustomeTextIcon({
                                text: value.popUpData.find(item => item.label === markerText.field)?.value,
                                bgcolor: markerText.color || green[600],
                                padding: '5px 10px'
                            })
                            : getCustomeIcon(icon || ICON.location1)
                    }
                >
                    {renderPopupContent(value.popUpData)}
                </Marker>
            ))}
        </>
    );
}

export default ElementContainer;