import { Divider, Stack, Typography } from "@mui/joy";
import { blue, green } from "@mui/material/colors";
import { ICON } from "constant";
import { getCustomeIcon } from "helper/getCustomeIcon";
import { getCustomeTextIcon } from "helper/getCustomeTextIcon";
import { Fragment, useCallback, useEffect, useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import { toast } from "react-toastify";
import PopupContent from "./PopupContent";

// Définition des types pour les données traitées par le worker
interface PopUpDataItem {
    label: string;
    value: any;
}

export interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

export default ({
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
    const jobIdRef = useRef(0);

    const cleanWorker = () => {
        if (workerRef.current) {

            workerRef.current.terminate();
            workerRef.current = null;
        }
    }

    const startStream = () => {
        cleanWorker();

        const jobId = ++jobIdRef.current;

        const worker = new Worker(
            new URL('../../../workers/ElementContainerWorker.ts', import.meta.url)
        );

        workerRef.current = worker;
        setProcessedPoints([]);

        worker.postMessage({
            type: 'START',
            jobId,
            data,
            fieldKeyListe
        });

        worker.onmessage = (e) => {
            const msg = e.data;

            if (msg.jobId !== jobIdRef.current) return;

            if (msg.type === 'CHUNK') {
                setProcessedPoints(prev => [...prev, ...msg.payload]);
            }

            if (msg.type === 'DONE') {
                cleanWorker();
            }
        };

        worker.onerror = () => cleanWorker();
    };

    const stopStream = () => {
        if (!workerRef.current) return;

        workerRef.current.postMessage({
            type: 'CANCEL',
            jobId: jobIdRef.current
        });

        cleanWorker();
    };

    useEffect(() => {
        if (!show) {
            stopStream();
            setProcessedPoints([]);
            return;
        }

        startStream();

        return () => {
            stopStream();
            setProcessedPoints([]);
        };

    }, [show, data, fieldKeyListe]);

    useEffect(() => {
        console.log('====================================');
        console.log(processedPoints);
        console.log('====================================');
    }, [processedPoints]);


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
                    key={`${value.coor[0]}-${value.coor[1]}`}
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
                    <PopupContent popUpData={value.popUpData} />
                </Marker>
            ))}
        </>
    );
}