import { create } from "zustand";

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    elementfailedList : string[];
}

export default create<Props_T>((set, get) => ({
    set: set,
    elementfailedList : []
}));