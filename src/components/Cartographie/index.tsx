import { MapContainer } from "react-leaflet";
import { Stack } from "@mui/joy";
import { useContext } from "react";
import { AppContext } from "../../providers";
import CurrentVillageElement from "../../features/CurrentVillageElement";
import CurrentCommuneElement from "../../features/CurrentCommuneElement";
import CoucheDonneeElement from "../../features/CoucheDonneeElement";
import CurrentProvinceElement from "features/CurrentProvinceElement";
import CurrentRegionElement from "features/CurrentRegionElement";
import { COLOR, COUCHE_DE_DONNEES_LISTE, LOCATION } from "constant";
import FicheDeDonneeElement from "features/FicheDeDonneeElement";
import FichesDynamiquesElement from "features/FichesDynamiquesElement";
import ConfigZone from "./ConfigZone";
import LocaliteElement from "features/LocaliteElement";
import RapportCartoElement from "features/RapportCartoElement";
import CountryMask from "./CountryMask";

const Cartographie = () => {
    const {
        mapRef,
        zoomLevel
    } = useContext(AppContext);

    const mainCouche = COUCHE_DE_DONNEES_LISTE[0];

    return (
        <Stack
            height={'100%'}
            bgcolor={COLOR.white}
            borderRadius={10}
            direction={"row"}
        >
            <Stack
                width={"100%"}
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