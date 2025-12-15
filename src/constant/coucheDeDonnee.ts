export const COUCHE_DE_DONNEES_LISTE = [
    {
        name: "Côte d'Ivoire",
        filePath: require("../assets/leaflet.shapefile/IvoryCoast.zip"),
        bound: [
        [4.3, -8.6],   // Sud-Ouest
        [10.7, -2.5]   // Nord-Est
    ],
    coordonnee: [7.54, -5.55]
    },
    {
        name: "Bamako",
        filePath: require("../assets/leaflet.shapefile/Bamako.zip"),
    },
    {
        name: "Bandiagara",
        filePath: require("../assets/leaflet.shapefile/Bandiagara.zip"),
    },
    {
        name: "Dioila",
        filePath: require("../assets/leaflet.shapefile/Dioila.zip"),
    },
    {
        name: '',
        filePath: require('../assets/leaflet.shapefile/CO01010.zip')
    },
    {
        name: 'Burkina Faso',
        filePath: require('../assets/leaflet.shapefile/BF.zip')
    },
    {
        name: 'Mali',
        filePath: require('../assets/leaflet.shapefile/Mali.zip')
    },
    {
        name: 'Cameroun',
        filePath: require('../assets/leaflet.shapefile/Cameroun.zip'),
        bound: [
            [1.6, 8.4],
            [13.1, 16.2]
        ],
        coordonnee: [7.3696495, 12.3445856]
    },
];