const path = (process.env.NODE_ENV == "production")
    ? process.env.REACT_APP_ROOT_URL_PROD
    : process.env.REACT_APP_ROOT_URL_DEV;

export default {
    locationVillage: `${path}/assets/images/icons/190691-200.png`,
    location1: `${path}/assets/images/icons/free-location-icon-2955-thumb.png`,
    location2: `${path}/assets/images/icons/6862196.png`,
    location3: `${path}/assets/images/icons/free-location-icon-2952-thumb.png`,
    location4: `${path}/assets/images/icons/64113.png`,
    location5: `${path}/assets/images/icons/pngtree-3d-location-icon-clipart-in-transparent-background-png-image_9095284.png`,
    location6: `${path}/assets/images/icons/pngtree-red-location-icon-vector-png-image_16578229.png`,
    location7: `${path}/assets/images/icons/tl.webp`,
    location8: `${path}/assets/images/icons/transparent-map-pin-icon-map-pin-icon-with-green-dot-red-gps-1710899612896.webp`,
}