import { useEffect, useRef } from "react";
import shp from 'shpjs';
import { useMap } from "react-leaflet";
import L from "leaflet";
import { getCustomeTextIcon } from "../../../helper/getCustomeTextIcon";
import { toast } from "react-toastify";
import addMetaDataToLayer from "./addMetaDataToLayer";

const ShapeFileContainer = ({
    coucheDeDonneesListe ,
    setcurrentRegionName = () => { },
    showName = true,
    showPopUp = false
}) => {
    const layersRef = useRef({});
    const regionMarkersRef = useRef({});
    const nameMarkersRef = useRef({}); // stocke tableaux de marqueurs si tu veux les référencer
    const nameLayerGroupsRef = useRef({}); // ⚡ layerGroup par filePath pour gérer showName rapidement
    const popupsRef = useRef({}); // ⚡ stocke tableaux de L.Popup par filePath pour showPopUp
    const map = useMap();

    const addRegionMarker = (filePath, marker) => {
        if (!regionMarkersRef.current[filePath]) regionMarkersRef.current[filePath] = [];
        regionMarkersRef.current[filePath].push(marker);
    };

    const addNameMarker = (filePath, marker) => {
        if (!nameMarkersRef.current[filePath]) nameMarkersRef.current[filePath] = [];
        nameMarkersRef.current[filePath].push(marker);

        // ensure we have a layerGroup for this filePath
        if (!nameLayerGroupsRef.current[filePath]) {
            nameLayerGroupsRef.current[filePath] = L.layerGroup();
        }
        nameLayerGroupsRef.current[filePath].addLayer(marker);
    };

    const addPopupInstance = (filePath, popup) => {
        if (!popupsRef.current[filePath]) popupsRef.current[filePath] = [];
        popupsRef.current[filePath].push(popup);
    };

    async function loadShapefile(coucheObject, imageUrl = undefined) {
        try {
            let geojson = await shp(coucheObject.filePath).catch(() => {
                toast.warning(`Le shape file de ${coucheObject.name || 'certains endroit'} ${coucheObject.name ? 'est' : 'sont'} introuvables. Veuillez ajouter`);
                return null;
            });
            if (!geojson) return;

            const geoJsonLayer = L.geoJSON(geojson, {
                style: () => ({
                    color: coucheObject?.couleur_c,
                    weight: 2,
                    opacity: 1,
                    fillOpacity: coucheObject?.opacity || 0.3,
                    fillColor: coucheObject?.couleur,
                }),
                onEachFeature: (feature, layer) => {
                    console.log(layer);

                    // --- CRÉATION MARQUEUR POINT (si géométrie de type Point) ---
                    if (feature.geometry.type === 'Point') {
                        const [lng, lat] = feature.geometry.coordinates;
                        // Créer le marqueur directement à partir des coordonnées du point
                        const marker = L.marker([lat, lng],).addTo(map);

                        // Stocker la référence du marqueur DANS LE TABLEAU
                        addRegionMarker(coucheObject.filePath, marker);

                        // Ajouter un gestionnaire d'événements pour le point
                        marker.on({
                            click: () => {
                                setcurrentRegionName && setcurrentRegionName(coucheObject.name);
                                map.setView([lat, lng], 14); // Zoom sur le point
                            }
                        });
                    }

                    // Calcul robuste du centre (pour point / polygone / autres)
                    let center = null;
                    try {
                        if (feature.geometry.type === 'Point') {
                            const [lng, lat] = feature.geometry.coordinates;
                            center = L.latLng(lat, lng);
                        } else if (typeof layer.getBounds === 'function') {
                            const b = layer.getBounds();
                            if (b && typeof b.getCenter === 'function') center = b.getCenter();
                        } else if (typeof layer.getLatLng === 'function') {
                            // certains layers (marker) ont getLatLng
                            center = layer.getLatLng();
                        }
                    } catch (err) {
                        console.warn("Erreur calcul centre :", err);
                    }

                    // --- CRÉATION MARQUEUR NOM DE LA RÉGION (pour tous les types, y compris Point) ---
                    if (center) { // ⚡ Ajouter condition showName + center existant
                        const regionIcon = getCustomeTextIcon({
                            text: coucheObject.name || coucheObject.nom_commune || '',
                            bgcolor: coucheObject?.textBgColor || 'transparent',
                            fontColor: coucheObject?.textColor || 'black',
                            fontSize: coucheObject?.fontSize || 10,
                        });

                        const nameMarker = L.marker(center, {
                            icon: regionIcon
                        });

                        // Stocker la référence du marqueur DANS LE TABLEAU et dans le layerGroup
                        addNameMarker(coucheObject.filePath, nameMarker);

                        // n'ajoute au map que si showName = true
                        if (showName) {
                            // assure que le layerGroup est sur la carte
                            if (!map.hasLayer(nameLayerGroupsRef.current[coucheObject.filePath])) {
                                map.addLayer(nameLayerGroupsRef.current[coucheObject.filePath]);
                            }
                        }
                    }

                    addMetaDataToLayer(layer, coucheObject.metaData);

                    layer.on({
                        click: () => {
                            setcurrentRegionName && setcurrentRegionName(coucheObject.name)

                            // Get the bounds of the region and zoom the map
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
            console.error("Erreur lors du chargement du shapefile : ", error);
        }
    }

    useEffect(() => {
        // Supprimer les couches et marqueurs qui ne sont plus dans la liste
        Object.keys(layersRef.current).forEach(filePath => {
            if (!coucheDeDonneesListe.find(v => v.filePath === filePath)) {
                map.removeLayer(layersRef.current[filePath]);
                delete layersRef.current[filePath];

                regionMarkersRef.current[filePath]?.forEach(m => map.removeLayer(m));
                delete regionMarkersRef.current[filePath];

                // retirer layerGroup des noms
                if (nameLayerGroupsRef.current[filePath]) {
                    if (map.hasLayer(nameLayerGroupsRef.current[filePath])) {
                        map.removeLayer(nameLayerGroupsRef.current[filePath]);
                    }
                    // clear group
                    nameLayerGroupsRef.current[filePath].clearLayers();
                    delete nameLayerGroupsRef.current[filePath];
                }
                if (nameMarkersRef.current[filePath]) {
                    delete nameMarkersRef.current[filePath];
                }

                // retirer popups
                if (popupsRef.current[filePath]) {
                    popupsRef.current[filePath].forEach(p => {
                        try { p.remove(); } catch (e) { /* ignore */ }
                    });
                    delete popupsRef.current[filePath];
                }
            }
        });

        // Charger les nouvelles couches
        coucheDeDonneesListe.forEach(value => {
            if (!layersRef.current[value.filePath]) loadShapefile(value);
        });
    }, [map, coucheDeDonneesListe]);

    // ⚡ Effet dédié pour toggle showName (on ajoute / retire les layerGroups)
    useEffect(() => {
        Object.keys(nameLayerGroupsRef.current).forEach(filePath => {
            const group = nameLayerGroupsRef.current[filePath];
            if (!group) return;
            if (showName) {
                if (!map.hasLayer(group)) map.addLayer(group);
            } else {
                if (map.hasLayer(group)) map.removeLayer(group);
            }
        });
    }, [map, showName]);

    // ⚡ Effet toggle showPopUp : ouvre/ferme toutes les popups créées
    useEffect(() => {
        Object.keys(popupsRef.current).forEach(filePath => {
            const arr = popupsRef.current[filePath] || [];
            arr.forEach(popup => {
                try {
                    if (showPopUp) {
                        // open without closing others (autoClose:false)
                        popup.openOn(map);
                    } else {
                        popup.remove();
                    }
                } catch (e) {
                    console.warn("Erreur toggle popup:", e);
                }
            });
        });
    }, [map, showPopUp]);

    return null;
};

export default ShapeFileContainer;
