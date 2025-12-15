import { faFileAlt, faGears, faMapLocationDot, faPieChart } from "@fortawesome/free-solid-svg-icons";
import { blue, green, orange, red } from "@mui/material/colors";
import CoucheDeDonnee from "components/CartoMenu/CoucheDeDonnee";
import FicheDeDonnee from "components/CartoMenu/FicheDeDonnee";
import FichesDynamiques from "components/CartoMenu/FichesDynamiques";
import RapportCartographique from "components/CartoMenu/RapportCartographique";

export const CARTO_MENU_EN_TETE_ZONE = [
    {
        nom: 'Couches de données',
        icon: faMapLocationDot,
        color: red,
        children: CoucheDeDonnee
    },
    {
        nom: `Fiches de données`,
        icon: faGears,
        color: green,
        children: FicheDeDonnee
    },
    {
        nom: 'Fiches dynamiques',
        icon: faFileAlt,
        color: orange,
        children: FichesDynamiques
    },
    {
        nom: 'Rapport cartographique',
        icon: faPieChart,
        color: blue,
        children: RapportCartographique
    },
];