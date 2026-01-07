import { green } from "@mui/material/colors";
import { ICON } from "constant";
import { getCustomeIcon } from "helper/getCustomeIcon";
import { getCustomeTextIcon } from "helper/getCustomeTextIcon";
import { useEffect, useState, useRef } from "react";
import { Marker } from "react-leaflet";
import { toast } from "react-toastify";
import PopupContent from "./PopupContent";
import type { ProcessedPoint } from "../../../workers/ElementContainerWorker";

const ElementContainer = ({
    data,
    fieldKeyListe,
    show = true,
    nomListe,
    icon = ICON.location1,
    markerText
}: {
    data: { [key: string]: any }[],
    fieldKeyListe: { originaleName: string; renamed?: string }[] | '*',
    show?: boolean,
    nomListe?: string,
    icon?: string,
    markerText?: {
        field: string;
        color?: string;
    };
}) => {
    const [processedPoints, setProcessedPoints] = useState<ProcessedPoint[]>([]);
    const workerRef = useRef<Worker | null>(null);

    const cleanWorker = () => {
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
    }

    const loadPoints = () => {
        cleanWorker();

        try {
            const worker = new Worker(new URL('../../../workers/ElementContainerWorker.ts', import.meta.url));
            workerRef.current = worker;

            worker.postMessage({ data, fieldKeyListe });

            worker.onmessage = (event) => {
                const newPoints: ProcessedPoint[] = event.data;
                setProcessedPoints(prev => [...prev, ...newPoints]);
            };

            worker.onerror = (err) => {
                console.error('Worker error', err);
                toast.error('Erreur dans le worker');
            };
        } catch (err) {
            console.error(err);
            toast.error('Impossible de charger les points');
        }
    }

    useEffect(() => {
        if (show) {
            setProcessedPoints([]);
            loadPoints();
            return cleanWorker;
        } else {
            setProcessedPoints([]);
            cleanWorker();
        }
    }, [data, show]);

    if (!show) return null;

    return (
        <>
            {processedPoints.map((point, idx) => (
                <Marker
                    position={point.coor}
                    key={idx}
                    icon={markerText
                        ? getCustomeTextIcon({
                            text: point.popUpData.find(p => p.label === markerText.field)?.value,
                            bgcolor: markerText.color || green[600],
                            padding: '5px 10px'
                        })
                        : getCustomeIcon(icon)
                    }
                >
                    <PopupContent popUpData={point.popUpData} />
                </Marker>
            ))}
        </>
    );
}

export default ElementContainer;
