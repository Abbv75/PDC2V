import { CARTO_MENU_EN_TETE_ZONE } from "constant";
import { createContext } from "react";
import { USE_STATE_T } from "types";

export const CartoMenuContext = createContext({} as {
    currentMenu: typeof CARTO_MENU_EN_TETE_ZONE[0],
    setcurrentMenu: USE_STATE_T,
    setcartoMenuIsOpen: USE_STATE_T,
    cartoMenuIsOpen: boolean
});