declare module 'dom-to-image-more' {
    interface Options {
        /**
         * A CSS selector to apply to the element. Default: null
         */
        filter?: (node: Node) => boolean;
        /**
         * A string of the pixel width of the exported image. Default: null
         */
        width?: number;
        /**
         * A string of the pixel height of the exported image. Default: null
         */
        height?: number;
        /**
         * The pixel ratio of the exported image. Default: 1
         */
        pixelRatio?: number;
        /**
         * A string of the background color for the exported image. Default: transparent
         */
        bgcolor?: string;
        /**
         * Whether to include the web font rules in the exported image. Default: false
         */
        cacheBust?: boolean; // deprecated, use `skipFonts` instead
        /**
         * Set the CSS style for the exported image.
         */
        style?: Record<string, string>;
        /**
         * A string of the data URL of the exported image. Default: null
         */
        imagePlaceholder?: string;
        /**
         * Whether to include all of the custom fonts used in the exported image. Default: true
         */
        skipFonts?: boolean;
        /**
         * The quality of the exported image. Default: 1
         */
        quality?: number; // for toJpeg and toWebp
        /**
         * A number of milliseconds to wait before rendering.
         */
        delay?: number;
    }

    function toPng(node: Node, options?: Options): Promise<string>;
    function toJpeg(node: Node, options?: Options): Promise<string>;
    function toSvg(node: Node, options?: Options): Promise<string>;
    function toBlob(node: Node, options?: Options): Promise<Blob>;
    function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;

    const domtoimage: {
        toPng: typeof toPng;
        toJpeg: typeof toJpeg;
        toSvg: typeof toSvg;
        toBlob: typeof toBlob;
        toPixelData: typeof toPixelData;
    };

    export default domtoimage;
}