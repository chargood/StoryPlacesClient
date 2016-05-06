/**
 * Created by kep1u13 on 05/05/2016.
 */

define([
    'leaflet'
], function (L) {
    return {
        greenIcon: L.icon({
            iconUrl: '../images/green/marker-icon.png',
            iconRetinaUrl: '../images/green/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        }),

        blueIcon: L.icon({
            iconUrl: '../images/blue/marker-icon.png',
            iconRetinaUrl: '../images/blue/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        }),

        redIcon: L.icon({
            iconUrl: '../images/red/marker-icon.png',
            iconRetinaUrl: '../images/red/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        })
    }
});
