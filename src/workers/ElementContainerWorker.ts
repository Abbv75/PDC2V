/* eslint-env worker */

interface ElementData {
    latitude: string | number;
    longitude: string | number;
    [key: string]: any;
}

interface FieldKey {
    originaleName: string;
    renamed?: string;
}

interface WorkerInputData {
    data: ElementData[];
    fieldKeyListe: FieldKey[] | '*';
}

interface PopUpDataItem {
    label: string;
    value: any;
}

interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

(globalThis as any).onmessage = function (event: MessageEvent<WorkerInputData>) {
    const { data, fieldKeyListe } = event.data;
    const processedPoints: ProcessedPoint[] = [];
    const chunkSize = 20;

    if (!Array.isArray(data) || data.length === 0) {
        console.warn('Worker: No valid data array to process.');
        globalThis.close(); // 🔥 fermeture immédiate
        return;
    }

    const LATITUDE_KEY = 'latitude';
    const LONGITUDE_KEY = 'longitude';

    data.forEach((currentElement: ElementData, index: number) => {
        const lat = parseFloat(String(currentElement[LATITUDE_KEY]));
        const lg = parseFloat(String(currentElement[LONGITUDE_KEY]));

        if (!isNaN(lat) && !isNaN(lg)) {
            const popUpData: PopUpDataItem[] = [];

            for (const key in currentElement) {
                if (key === 'textIcon') continue;

                const field = fieldKeyListe === '*'
                    ? { originaleName: key, renamed: key }
                    : fieldKeyListe.find(x => x.originaleName === key);

                if (field) {
                    popUpData.push({
                        label: field.renamed || field.originaleName,
                        value: currentElement[key]
                    });
                }
            }

            processedPoints.push({
                coor: [lat, lg],
                popUpData
            });
        }

        // envoi par chunks
        if (
            processedPoints.length > 0 &&
            (
                (index + 1) % chunkSize === 0 ||
                (index + 1) === data.length
            )
        ) {
            (globalThis as any).postMessage(structuredClone(processedPoints));
            processedPoints.length = 0;
        }
    });

    // sécurité finale
    if (processedPoints.length > 0) {
        (globalThis as any).postMessage(structuredClone(processedPoints));
    }

    console.log('Worker: traitement terminé, fermeture.');

    globalThis.close(); // 🔥🔥🔥 TRÈS IMPORTANT
};

console.log('Worker: ElementContainerWorker.ts chargé.');
export { };