import L from 'leaflet';

export const dataConstants = {
    divIconDanger: L.divIcon({
        className: '', 
        iconSize: [10,10], 
        iconAnchor: [0, 0], 
        html: `
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="3" stroke="#E33033" stroke-width="1" fill="#E33033" />
        </svg>`
    }),
    divIconDefault: L.divIcon({
        className: '', 
        iconSize: [10,10], 
        iconAnchor: [0, 0], 
        html: `
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="3" stroke="purple" stroke-width="1" fill="purple" />
        </svg>`
    }),
    divIconSuccess: L.divIcon({
        className: '', 
        iconSize: [10,10], 
        iconAnchor: [0, 0], 
        html: `
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="3" stroke="#093" stroke-width="1" fill="#093" />
        </svg>`
    }),
    divIconWarning: L.divIcon({
        className: '', 
        iconSize: [10,10], 
        iconAnchor: [0, 0], 
        html: `
        <svg height="10" width="10">
            <circle cx="5" cy="5" r="3" stroke="#FFB43F" stroke-width="1" fill="#FFB43F" />
        </svg>`
    })
}