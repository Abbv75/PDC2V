declare module 'downloadjs' {
    export default function download(data: Blob | string, filename?: string, mimeType?: string): void;
}