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

// Use globalThis instead of self to avoid ESLint no-restricted-globals
(globalThis as any).onmessage = function (event: MessageEvent<WorkerInputData>) {
    const { data, fieldKeyListe } = event.data;
    const processedPoints: ProcessedPoint[] = [];
    const chunkSize = 20;

    console.log('Worker: Data received:', data);
    console.log('Worker: Field Key List received:', fieldKeyListe);
    console.log('Worker: Initial data length:', data ? data.length : 0);

    if (!Array.isArray(data) || data.length === 0) {
        console.warn('Worker: No valid data array to process.');
        return;
    }

    const LATITUDE_KEY = 'latitude';
    const LONGITUDE_KEY = 'longitude';

    data.forEach((currentElement: ElementData, index: number) => {
        const lat = parseFloat(String(currentElement[LATITUDE_KEY]));
        const lg = parseFloat(String(currentElement[LONGITUDE_KEY]));

        if (typeof lat === 'number' && typeof lg === 'number' && !isNaN(lat) && !isNaN(lg)) {
            const popUpData: PopUpDataItem[] = [];
            for (let key in currentElement) {
                if(key == 'textIcon'){
                    continue;
                }
                
                const field = fieldKeyListe == '*' ? {
                    originaleName: key,
                    renamed: key
                } : fieldKeyListe.find(x => x.originaleName === key);

                if (field) {
                    popUpData.push({
                        label: field.renamed || field.originaleName,
                        value: currentElement[key]
                    });
                }
            }

            processedPoints.push({
                coor: [lat, lg],
                popUpData: popUpData
            });

        } else {
            console.log('lat:', lat, '| lg:', lg);
            console.warn('Worker: ElementContainerWorker.ts a ignorer des elements car ils ont pas de champs de coordonee valides', currentElement);
            console.warn('  Latitude :', lat, 'Longitude :', lg);
        }

        // Envoyer les points par paquet pour un affichage progressif
        if (processedPoints.length > 0 && ((index + 1) % chunkSize === 0 || (index + 1) === data.length)) {
            console.log(`Worker: envoie de paquet de ${processedPoints.length} points.`);
            (globalThis as any).postMessage(structuredClone(processedPoints));
            processedPoints.length = 0;
        }
    });

    // Envoyer le dernier paquet s'il reste des points
    if (processedPoints.length > 0) {
        console.log(`Worker: a envoyer ses derniers paquet de ${processedPoints.length} points.`);
        (globalThis as any).postMessage(structuredClone(processedPoints));
    }

    console.log('Worker: ElementContainerWorker.ts a finit tout ses traitements.');
};

console.log('Worker: ElementContainerWorker.ts est en cours de chargement.');

export { };