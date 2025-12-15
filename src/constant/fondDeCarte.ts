export const FOND_DE_CARTE = [
    {
        nom: 'OpenStreetMap Standard',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        description: 'Carte par défaut avec un style généraliste.'
    },
    {
        nom: 'OpenTopoMap',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        description: 'Carte topographique de type classique, très détaillée, adaptée pour l’exploration et les activités de plein air.'
    },
    {
        nom: 'OpenStreetMap Humanitarian',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        description: 'Spécialement conçue pour les opérations humanitaires.'
    },
    {
        nom: 'CartoDB Positron (Clair)',
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        description: 'Style clair et épuré, parfait pour des cartes modernes.'
    },
    {
        nom: 'CartoDB Dark Matter (Foncé)',
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        description: 'Version sombre, adaptée aux cartes nocturnes ou aux thèmes sombres.'
    },
    {
        nom: 'Esri World Street Map',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        description: 'Carte des rues détaillée, fournie par Esri.'
    },
    {
        nom: 'Esri World Imagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        description: 'Imagerie satellite de haute résolution, idéale pour l’analyse géospatiale.'
    },
    {
        nom: 'CartoDB Voyager',
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        description: 'Style équilibré entre détails et épure, parfait pour une application multi-usage.'
    },
    {
        nom: 'OpenStreetMap Satellite (USGS)',
        url: 'https://basemap.nationalmap.gov/ArcGIS/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
        description: "Imagerie satellite fournie par l'USGS, avec une bonne couverture et des images de qualité."
    },
];