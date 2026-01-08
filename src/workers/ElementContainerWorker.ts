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

interface WorkerStartMessage {
    type: 'START';
    jobId: number;
    data: ElementData[];
    fieldKeyListe: FieldKey[] | '*';
}

interface WorkerCancelMessage {
    type: 'CANCEL';
    jobId: number;
}

type WorkerMessage = WorkerStartMessage | WorkerCancelMessage;

interface PopUpDataItem {
    label: string;
    value: any;
}

interface ProcessedPoint {
    coor: [number, number];
    popUpData: PopUpDataItem[];
}

let cancelledJobId: number | null = null;

(globalThis as any).onmessage = async (event: MessageEvent<WorkerMessage>) => {
    const msg = event.data;

    if (msg.type === 'CANCEL') {
        cancelledJobId = msg.jobId;
        return;
    }

    if (msg.type !== 'START') return;

    const { jobId, data, fieldKeyListe } = msg;
    cancelledJobId = null;

    if (!Array.isArray(data) || data.length === 0) {
        (globalThis as any).postMessage({ type: 'DONE', jobId });
        globalThis.close();
        return;
    }

    const chunkSize = 20;
    let buffer: ProcessedPoint[] = [];

    const LAT = 'latitude';
    const LNG = 'longitude';

    for (let i = 0; i < data.length; i++) {

        // 🛑 stream stoppé
        if (cancelledJobId === jobId) {
            (globalThis as any).postMessage({ type: 'DONE', jobId });
            globalThis.close();
            return;
        }

        const el = data[i];
        const lat = parseFloat(String(el[LAT]));
        const lng = parseFloat(String(el[LNG]));

        if (!isNaN(lat) && !isNaN(lng)) {
            const popUpData: PopUpDataItem[] = [];

            for (const key in el) {
                if (key === 'textIcon') continue;

                const field = fieldKeyListe === '*'
                    ? { originaleName: key, renamed: key }
                    : fieldKeyListe.find(f => f.originaleName === key);

                if (field) {
                    popUpData.push({
                        label: field.renamed || field.originaleName,
                        value: el[key]
                    });
                }
            }

            buffer.push({
                coor: [lat, lng],
                popUpData
            });
        }

        // 📦 envoi chunk
        if (buffer.length === chunkSize || i === data.length - 1) {
            (globalThis as any).postMessage({
                type: 'CHUNK',
                jobId,
                payload: structuredClone(buffer)
            });
            buffer = [];
        }

        // ⏳ yield (évite blocage CPU)
        await new Promise(r => setTimeout(r, 0));
    }

    (globalThis as any).postMessage({ type: 'DONE', jobId });
    globalThis.close();
};

export { };
