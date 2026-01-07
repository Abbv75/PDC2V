/* eslint-env worker */

interface ElementData {
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

export interface PopUpDataItem {
    label: string;
    value: any;
}

export interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

// Toutes les variantes possibles
const LAT_KEYS = ['latitude','lat','l','LAT','LATITUDE','LT'];
const LNG_KEYS = ['longitude','lng','LG','LONG','LONGITUDE'];

/**
 * Trouve la première clé avec une valeur valide
 */
const findValidKey = (obj: Record<string, any>, keys: string[]): string | null => {
    for (const key of keys) {
        const k = key in obj ? key : key.toLowerCase() in obj ? key.toLowerCase() : null;
        if (k && obj[k] !== null && obj[k] !== undefined && obj[k] !== '') {
            return k;
        }
    }
    return null;
};

(globalThis as any).onmessage = (event: MessageEvent<WorkerInputData>) => {
    const { data, fieldKeyListe } = event.data;
    const processedPoints: ProcessedPoint[] = [];
    const chunkSize = 20;

    console.log('Worker: received data', data.length);

    if (!Array.isArray(data) || data.length === 0) return;

    data.forEach((element: ElementData, idx: number) => {
        const latKey = findValidKey(element, LAT_KEYS);
        const lngKey = findValidKey(element, LNG_KEYS);

        if (!latKey || !lngKey) {
            console.warn('Worker: Ignoring element, no valid lat/lng key', element);
            return;
        }

        const lat = parseFloat(String(element[latKey]));
        const lng = parseFloat(String(element[lngKey]));

        if (isNaN(lat) || isNaN(lng)) {
            console.warn('Worker: Ignoring element, lat/lng not a number', element);
            return;
        }

        const popUpData: PopUpDataItem[] = [];
        for (const key in element) {
            if (key === 'textIcon') continue;

            const field = fieldKeyListe === '*' 
                ? { originaleName: key, renamed: key } 
                : fieldKeyListe.find(x => x.originaleName === key);

            if (field) {
                popUpData.push({
                    label: field.renamed || field.originaleName,
                    value: element[key]
                });
            }
        }

        processedPoints.push({
            coor: [lat, lng],
            popUpData
        });

        // Envoyer par paquet
        if (processedPoints.length > 0 && ((idx + 1) % chunkSize === 0 || (idx + 1) === data.length)) {
            (globalThis as any).postMessage(structuredClone(processedPoints));
            processedPoints.length = 0;
        }
    });

    // Dernier paquet
    if (processedPoints.length > 0) {
        (globalThis as any).postMessage(structuredClone(processedPoints));
    }

    console.log('Worker: finished processing');
};

console.log('Worker: ElementContainerWorker.ts loaded');
export {};