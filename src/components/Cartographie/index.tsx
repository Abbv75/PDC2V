import { MapContainer } from "react-leaflet";
import { Stack } from "@mui/joy";
import { useContext } from "react";
import { AppContext } from "../../providers";
import CurrentVillageElement from "../../features/CurrentVillageElement";
import CurrentCommuneElement from "../../features/CurrentCommuneElement";
import CoucheDonneeElement from "../../features/CoucheDonneeElement";
import CurrentProvinceElement from "features/CurrentProvinceElement";
import CurrentRegionElement from "features/CurrentRegionElement";
import { COUCHE_DE_DONNEES_LISTE } from "constant";
import FicheDeDonneeElement from "features/FicheDeDonneeElement";
import FichesDynamiquesElement from "features/FichesDynamiquesElement";
import LocaliteElement from "features/LocaliteElement";
import RapportCartoElement from "features/RapportCartoElement";
import CountryMask from "./CountryMask";
import useMapStore from "stores/map/useMapStore";
import ConfigZone from "./ConfigZone";

const Cartographie = () => {
    const {
        mapRef,
    } = useContext(AppContext);
    
    const { zoomLevel } = useMapStore();

    const mainCouche = COUCHE_DE_DONNEES_LISTE[0];

    return (
        <Stack
            width={'100%'}
        >
            <Stack
                height={"100%"}
                ref={mapRef}
            >
                <MapContainer
                    center={mainCouche.coordonnee as any}
                    zoom={zoomLevel}
                    scrollWheelZoom={true}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 5,
                        overflow: "hidden"
                    }}
                    minZoom={6}
                    maxBounds={mainCouche.bound as any}
                    maxBoundsViscosity={1} // 1.0 = Bloque totalement. 0.5 = Effet élastique.
                >
                    <ConfigZone />

                    <CurrentVillageElement />

                    <CurrentCommuneElement />

                    <CurrentProvinceElement />

                    <CurrentRegionElement />

                    <CoucheDonneeElement />

                    <FicheDeDonneeElement />

                    <FichesDynamiquesElement />

                    <LocaliteElement />

                    <RapportCartoElement />

                    {/* <ShapeFileContainer coucheDeDonneesListe={[{
                        filePath: COUCHE_DE_DONNEES_LISTE[7].filePath,
                        opacity: 0.02,
                        // couleur_c: green[800],
                    } as SHAPE_OBJECT_T]} /> */}

                    <CountryMask />

                </MapContainer>
            </Stack>
        </Stack>
    )
}

export default Cartographie;