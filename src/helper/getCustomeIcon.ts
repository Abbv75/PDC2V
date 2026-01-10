import L from 'leaflet';

export const getCustomeIcon = (imageUrl: string, size: number = 40) => {
    const halfSize = size / 2;
    return new L.Icon({
        iconUrl: imageUrl,
        iconSize: [size, size],
        iconAnchor: [halfSize, size],
        popupAnchor: [0, -size],
    });
};

