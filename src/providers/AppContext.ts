import { createContext, useRef } from "react";
import { ShapeFileColorEditerSubmitFunctionT } from "types";

interface AppContextProps {
    mapRef: React.RefObject<HTMLDivElement>;
    legendeSection: any;
    setlegendeSection: React.Dispatch<React.SetStateAction<{}>>;
    addImageIsOpen: boolean;
    setaddImageIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showFiligram: boolean;
    setshowFiligram: React.Dispatch<React.SetStateAction<boolean>>;
    showShapeFileColorEditer: boolean;
    setshowShapeFileColorEditer: React.Dispatch<React.SetStateAction<boolean>>;
    setShapeFileColorEditerSubmitFunction: (fn: ShapeFileColorEditerSubmitFunctionT) => void;
    ShapeFileColorEditerSubmitFunction: ShapeFileColorEditerSubmitFunctionT;
    ShapeFileColorEditerDefaultValues: {
        borderColor?: string;
        backgroundColor?: string;
    } | undefined;
    setShapeFileColorEditerDefaultValues: (values: {
        borderColor?: string;
        backgroundColor?: string;
    } | undefined) => void;
}

export const AppContext = createContext<AppContextProps>({
    mapRef: { current: null },
    legendeSection: {},
    setlegendeSection: () => {},
    addImageIsOpen: false,
    setaddImageIsOpen: () => {},
    showFiligram: false,
    setshowFiligram: () => {},
    showShapeFileColorEditer: false,
    setshowShapeFileColorEditer: () => {},
    setShapeFileColorEditerSubmitFunction: () => {},
    ShapeFileColorEditerSubmitFunction: () => {},
    ShapeFileColorEditerDefaultValues: undefined,
    setShapeFileColorEditerDefaultValues: () => {},
});

