declare module "react-rnd" {
    import * as React from "react";

    export interface RndDragCallback {
        (e: MouseEvent | TouchEvent, data: { x: number; y: number }): void;
    }

    export interface RndProps {
        size?: { width: number | string; height: number | string };
        position?: { x: number; y: number };
        onDragStop?: RndDragCallback;
        enableResizing?: boolean | Record<string, boolean>;
        style?: React.CSSProperties;
        children?: React.ReactNode;
    }

    export class Rnd extends React.Component<RndProps> { }
}