import { ICON } from "constant";
import getAllIcon from "functions/API/icon/getAllIcon";
import { create } from "zustand";

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    iconList: string[];
    loadIconList: () => void;
    showImagePicker : boolean,
    onChange ?: (value : string)=>any
}

export default create<Props_T>((set, get) => ({
    set: set,
    iconList: [],
    loadIconList: () => {
        getAllIcon().then(res => {
            set({
                iconList: [
                    ...Object.values(ICON),
                    ...res?.map(
                        ({ file }) => `https://sise-pdc2v.org/icon_carto/${file}`
                    ) ?? []
                ]
            });
        });
    },
    showImagePicker : false
}));