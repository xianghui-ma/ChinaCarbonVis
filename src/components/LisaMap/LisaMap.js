import L from 'leaflet';
import axios from 'axios';
import PubSub from 'pubsub-js';

export const loadMap = (containerId)=>{
    let map = L.map(containerId, {
        zoomControl: true
    }).setView([38.56, 104.20], 4);
    // https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTEzY2YwbDBwMnZzanV6ZnB2NmVxIn0.nCgfpyifVAgg4i5g8ahMOQ
    // https://webapi.amap.com/maps?v=1.4.15&key=f29e17bbb6439d7b3b49302247ad4ace
    L.tileLayer("http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map);
    return map;
}
export const loadLisa = async (geojsonUrl, lisaUrl, map)=>{
    let geojson = await axios.get(geojsonUrl);
    let lisa = await axios.get(lisaUrl);
    geojson = geojson.data;
    lisa = lisa.data;
    let colorMap = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    return L.geoJSON(geojson, {
        style: (feature)=>{
            return {
                fillColor: colorMap[lisa[feature.properties.adcode].lisa],
                fillOpacity: 0.82,
                weight: 1,
                color: '#fff'
            };
        }
    }).addTo(map);
}
export const addHeter = async (mes, geojsonUrl, map, layerRecord)=>{
    const {adcode, fillColor, cluNum} = mes;
    let geojson = await axios.get(geojsonUrl);
    geojson = geojson.data;
    layerRecord[cluNum] = L.geoJSON(geojson, {
        style: (feature)=>{
            return {
                fillColor: 'transparent',
                fillOpacity: 0,
                weight: 2,
                color: adcode.indexOf(feature.properties.adcode + '') !== -1 ? fillColor : 'transparent'
            };
        }
    }).addTo(map);
}
export const markParallelCity = async (cityList, map, latLonUrl, prePoints)=>{
    let latLons = await axios.get(latLonUrl);
    latLons = latLons.data;
    const myCustomColour = '#583470';

    const markerHtmlStyles = `
    background-color: ${myCustomColour};
    width: 15px;
    height: 15px;
    display: block;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`;

    const icon = L.divIcon({
        className: "my-custom-pin",
        html: `<span style="${markerHtmlStyles}" />`
    });
    prePoints.forEach((item)=>{
        item.remove();
    });
    cityList.forEach((adcode)=>{
        let mark = L.marker([latLons[adcode].lat, latLons[adcode].lon], {
            icon
        }).addTo(map)
        .on('click', (e)=>{
            PubSub.publish('chooseMarkCity', e.target.adcode);
        })
        mark.adcode = adcode;
        prePoints.push(mark);
    });
}