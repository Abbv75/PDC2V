import { LAT_KEYS, LNG_KEYS } from "constant";
import { create } from "zustand";

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    showShapefileName: boolean;
    showShapefilePopup: boolean;
    keyToHides: string[];
    addKeyToHide: (key: string) => void;
    removeKeyToHide: (key: string) => void;
}

export default create<Props_T>((set, get) => ({
    set: set,
    showShapefileName: true,
    showShapefilePopup: false,
    keyToHides: [LAT_KEYS, LNG_KEYS].flat(),
    addKeyToHide: (key: string) =>
        set((state) => ({
            keyToHides: state.keyToHides.includes(key)
                ? state.keyToHides
                : [...state.keyToHides, key],
        })),

    removeKeyToHide: (key: string) =>
        set((state) => ({
            keyToHides: state.keyToHides.filter((k) => k !== key),
        })),
}));