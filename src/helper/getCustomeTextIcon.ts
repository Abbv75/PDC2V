import L from 'leaflet';

export const getCustomeTextIcon = (
    data: {
        text: string,
        bgcolor: string,
        fontWeight?: 'normal' | 700,
        fontStyle?: 'normal' | 'italic',
        fontSize?: number | 'normal',
        padding?: '5px 10px' | string,
        fontColor?: 'black'
    } = {
            text: 'text',
            bgcolor: 'green',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: 'normal',
            padding: '5px 10px',
            fontColor: 'black'
        }
) => (
    L.divIcon({
        html: `<div 
            style="
                padding:${data.padding}; 
                background : ${data.bgcolor}; 
                border-radius:50px;
                display: flex;
                align-items: center;
                justify-content: center;
                width : fit-content;
                maxWidth : 100px;
                font-weight : ${data.fontWeight};
                font-style : ${data.fontStyle};
                font-size : ${data.fontSize == "normal" ? "normal" : data.fontSize + 'px'};
                color : ${data.fontColor};
            "
        >
            ${data.text}
        </div>`,
        className: '',
        iconSize: [40, 40], // Taille de l'icône
        iconAnchor: [30, 10], // Point d'ancrage de l'icône (la base du marqueur)
        popupAnchor: [0, -40], // Point d'ancrage du popup par rapport au marqueur
    })
);