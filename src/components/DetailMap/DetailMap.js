import L from 'leaflet';
export const loadMap = ()=>{
    let map = L.map('detailMap', {
        zoomControl:false
    }).setView([38.56, 104.20], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTRwdGUwaHpnMnV0Z2puN3hqY2Y4In0.JPUf6RG-a2zrvBVsyKLAFA').addTo(map);
}