import L from 'leaflet';

export const getCustomeIcon = (imageUrl: string) => (
    new L.Icon({
        iconUrl: imageUrl,
        iconSize: [40, 40], // Taille de l'icône
        iconAnchor: [20, 40], // Point d'ancrage de l'icône (la base du marqueur)
        popupAnchor: [0, -40], // Point d'ancrage du popup par rapport au marqueur
    })
)