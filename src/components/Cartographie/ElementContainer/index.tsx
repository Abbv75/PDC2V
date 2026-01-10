import { green } from "@mui/material/colors";
import { ICON } from "constant";
import { getCustomeIcon } from "helper/getCustomeIcon";
import { getCustomeTextIcon } from "helper/getCustomeTextIcon";
import { useCallback, useEffect, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import { toast } from "react-toastify";
import PopUpContent, { type PopUpDataItem } from "./PopUpContent";

export interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

interface ElementContainerProps {
    data: { [key: string]: any, longitude?: number | string, latitude?: number | string }[],
    fieldKeyListe: { originaleName: string, renamed?: string }[] | '*',
    show?: boolean,
    nomListe?: string,
    icon?: string,
    markerText?: {
        field: string,
        color?: string
    }
}

const ElementContainer = ({
    data,
    fieldKeyListe,
    show = true,
    nomListe,
    icon = ICON.location1,
    markerText
}: ElementContainerProps) => {
    const [processedPoints, setProcessedPoints] = useState<ProcessedPoint[]>([]);
    const workerRef = useRef<Worker | null>(null);
    const mountedRef = useRef(true);
    const loadPointRef = useRef<(() => void) | null>(null);

    const cleanWorker = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }, []);

    const loadPoint = useCallback(() => {
        if (!mountedRef.current) return;

        try {
            // toast.info(`Compilation des ${nomListe}`);

            // Clean up any existing worker before creating a new one
            cleanWorker();

            const worker = new Worker(new URL('../../../workers/ElementContainerWorker.ts', import.meta.url));
            workerRef.current = worker;

            worker.postMessage({ data, fieldKeyListe });

            worker.onmessage = (event) => {
                if (!mountedRef.current) return;
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
    }, [data, fieldKeyListe, nomListe, cleanWorker]);

    // Store loadPoint in ref to avoid recreating it on every render
    useEffect(() => {
        loadPointRef.current = loadPoint;
    }, [loadPoint]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            cleanWorker();
        };
    }, [cleanWorker]);

    useEffect(() => {
        if (show) {
            setProcessedPoints([]);
            loadPointRef.current?.();
        } else {
            setProcessedPoints([]);
            cleanWorker();
        }
    }, [show, icon, cleanWorker]);

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
                    <PopUpContent popUpData={value.popUpData} />
                </Marker>
            ))}
        </>
    );
}

export default ElementContainer;

