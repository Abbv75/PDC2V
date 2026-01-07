import { useEffect, useRef } from "react";
import shp from 'shpjs';
import { useMap } from "react-leaflet";
import L from "leaflet";
import { getCustomeTextIcon } from "../../../helper/getCustomeTextIcon";
import { toast } from "react-toastify";
import addMetaDataToLayer from "./addMetaDataToLayer";
import useShapeFileContainerStore from "stores/shapeFileContainer/useShapeFileContainerStore";
import useReglageStore from "stores/reglage/useReglageStore";

const ShapeFileContainer = ({
    coucheDeDonneesListe,
    setcurrentRegionName = () => { },
}) => {
    // Récupération de l'état et de la fonction de mise à jour du store
    const { elementfailedList } = useShapeFileContainerStore();
    const setShapeFileContainerData = useShapeFileContainerStore((state) => state.set);

    const { showShapefileName, showShapefilePopup } = useReglageStore();

    const layersRef = useRef({});
    const regionMarkersRef = useRef({});
    const nameMarkersRef = useRef({});
    const nameLayerGroupsRef = useRef({});
    const popupsRef = useRef({});
    const map = useMap();

    // Fonction utilitaire pour ajouter un filePath à la liste des échecs dans le store
    const markAsFailed = (filePath) => {
        setShapeFileContainerData((state) => ({
            elementfailedList: [...new Set([...state.elementfailedList, filePath])]
        }));
    };

    const addRegionMarker = (filePath, marker) => {
        if (!regionMarkersRef.current[filePath]) regionMarkersRef.current[filePath] = [];
        regionMarkersRef.current[filePath].push(marker);
    };

    const addNameMarker = (filePath, marker) => {
        if (!nameMarkersRef.current[filePath]) nameMarkersRef.current[filePath] = [];
        nameMarkersRef.current[filePath].push(marker);
        if (!nameLayerGroupsRef.current[filePath]) {
            nameLayerGroupsRef.current[filePath] = L.layerGroup();
        }
        nameLayerGroupsRef.current[filePath].addLayer(marker);
    };

    async function loadShapefile(coucheObject) {
        // Si l'élément est déjà marqué comme échoué, on ignore le chargement
        if (elementfailedList.includes(coucheObject.filePath)) return;

        try {
            // Tentative de récupération du GeoJSON
            let geojson = await shp(coucheObject.filePath).catch((err) => {
                console.error(`Erreur réseau/parsing pour ${coucheObject.filePath}:`, err);
                return null;
            });

            // Si shpjs retourne null ou échoue
            if (!geojson) {
                toast.error(`Erreur de chargement : ${coucheObject.name || 'Fichier'}`);
                markAsFailed(coucheObject.filePath);
                return;
            }

            const geoJsonLayer = L.geoJSON(geojson, {
                style: () => ({
                    color: coucheObject?.couleur_c,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: coucheObject?.opacity || 0.3,
                    fillColor: coucheObject?.couleur,
                }),
                onEachFeature: (feature, layer) => {
                    // --- LOGIQUE GÉOMÉTRIE POINT ---
                    if (feature.geometry.type === 'Point') {
                        const [lng, lat] = feature.geometry.coordinates;
                        const marker = L.marker([lat, lng]).addTo(map);
                        addRegionMarker(coucheObject.filePath, marker);

                        marker.on({
                            click: () => {
                                setcurrentRegionName && setcurrentRegionName(coucheObject.name);
                                map.setView([lat, lng], 14);
                            }
                        });
                    }

                    // --- CALCUL DU CENTRE ---
                    let center = null;
                    try {
                        if (feature.geometry.type === 'Point') {
                            const [lng, lat] = feature.geometry.coordinates;
                            center = L.latLng(lat, lng);
                        } else if (typeof layer.getBounds === 'function') {
                            const b = layer.getBounds();
                            if (b && typeof b.getCenter === 'function') center = b.getCenter();
                        }
                    } catch (err) {
                        console.warn("Erreur calcul centre :", err);
                    }

                    // --- MARQUEUR NOM ---
                    if (center) {
                        const regionIcon = getCustomeTextIcon({
                            text: coucheObject.name || coucheObject.nom_commune || '',
                            bgcolor: coucheObject?.textBgColor || 'transparent',
                            fontColor: coucheObject?.textColor || 'black',
                            fontSize: coucheObject?.fontSize || 10,
                        });

                        const nameMarker = L.marker(center, { icon: regionIcon });
                        addNameMarker(coucheObject.filePath, nameMarker);

                        if (showShapefileName) {
                            if (!map.hasLayer(nameLayerGroupsRef.current[coucheObject.filePath])) {
                                map.addLayer(nameLayerGroupsRef.current[coucheObject.filePath]);
                            }
                        }
                    }

                    addMetaDataToLayer(layer, coucheObject.metaData);

                    layer.on({
                        click: () => {
                            setcurrentRegionName && setcurrentRegionName(coucheObject.name);
                            if (typeof layer.getBounds === 'function') {
                                const b = layer.getBounds();
                                if (b) map.fitBounds(b, { padding: [20, 20] });
                            } else if (center) {
                                map.setView(center, 14);
                            }
                        }
                    });
                },
            });

            geoJsonLayer.addTo(map);
            layersRef.current[coucheObject.filePath] = geoJsonLayer;

        } catch (error) {
            // Capture toute autre erreur (rendu Leaflet, etc.)
            console.error("Erreur critique sur le shapefile : ", error);
            markAsFailed(coucheObject.filePath);
            toast.error(`Le fichier ${coucheObject.name} présente une erreur interne.`);
        }
    }

    useEffect(() => {
        // 1. Nettoyage des couches supprimées
        Object.keys(layersRef.current).forEach(filePath => {
            if (!coucheDeDonneesListe.find(v => v.filePath === filePath)) {
                map.removeLayer(layersRef.current[filePath]);
                delete layersRef.current[filePath];

                regionMarkersRef.current[filePath]?.forEach(m => map.removeLayer(m));
                delete regionMarkersRef.current[filePath];

                if (nameLayerGroupsRef.current[filePath]) {
                    if (map.hasLayer(nameLayerGroupsRef.current[filePath])) {
                        map.removeLayer(nameLayerGroupsRef.current[filePath]);
                    }
                    nameLayerGroupsRef.current[filePath].clearLayers();
                    delete nameLayerGroupsRef.current[filePath];
                }
                delete nameMarkersRef.current[filePath];
            }
        });

        // 2. Chargement des nouvelles couches
        coucheDeDonneesListe.forEach(value => {
            // On ne charge que si ce n'est pas déjà affiché ET que ce n'est pas dans la liste d'échec
            if (!layersRef.current[value.filePath] && !elementfailedList.includes(value.filePath)) {
                loadShapefile(value);
            }
        });
    }, [map, coucheDeDonneesListe, elementfailedList]); // Ajout de elementfailedList en dépendance

    // ... (rest of the useEffects for showShapefileName and showPopUp remain the same)

    return null;
};

export default ShapeFileContainer;