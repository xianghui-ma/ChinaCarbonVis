import L from 'leaflet';
import axios from 'axios';
import * as d3 from "d3";

let globalGeojson = null;
let globalMesDom = null;
let globalMes = null;

export const loadLisaMap = async (geojsonUrl, lisaUrl, containerId)=>{
    let geojson = await axios.get(geojsonUrl);
    let lisa = await axios.get(lisaUrl);
    geojson = geojson.data;
    lisa = lisa.data;
    let colorMap = {
        'HH': '#CC3399',
        'LL': '#66CC99',
        'HL': '#FFCC99',
        'LH': '#CC9966',
        'NS': '#999999'
    };
    let map = L.map(containerId, {
        zoomControl: false
    }).setView([38.56, 104.20], 3);
    L.tileLayer('https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTRwdGUwaHpnMnV0Z2puN3hqY2Y4In0.JPUf6RG-a2zrvBVsyKLAFA').addTo(map);
    L.geoJSON(geojson, {
        style: (feature)=>{
            return {
                fillColor: colorMap[lisa[feature.properties.adcode].lisa],
                fillOpacity: 1,
                weight: 0.5,
                color: '#fff'
            };
        }
    }).addTo(map);
    return map;
}

export const loadMap = ()=>{
    let map = L.map('chinaMap', {
        zoomControl: false
    }).setView([38.56, 104.20], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTRwdGUwaHpnMnV0Z2puN3hqY2Y4In0.JPUf6RG-a2zrvBVsyKLAFA').addTo(map);
    return map;
}

export const getColor = async (dataUrl)=>{
    let colorLabel = await axios.get(dataUrl);
    return colorLabel.data;
}

const updateMesPanel = (adcode)=>{
    let mes = globalMes[adcode];
    let mesStr = `<p class="city">${mes.city}</p>`;
    for(let key in mes){
        if(key !== 'city'){
            mesStr += `<p class='mes'>${key.replace('cof_', '')}：${parseFloat(mes[key]).toFixed(2)}</p>`;
        }
    }
    globalMesDom.innerHTML = mesStr;
}

const highLightFeature = (e)=>{
    let layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    updateMesPanel(layer.feature.properties.adcode)
}

const cancleHighlight = (e)=>{
    globalGeojson.resetStyle(e.target);
    globalMesDom.innerHTML = '<p class="city">各市驱动因素</p>';
}

const bindEventOnFeature = (feature, layer)=>{
    layer.on({
        mouseover: highLightFeature,
        mouseout: cancleHighlight
    });
}

export const addMessageControl = (map)=>{
    L.Control.Legend = L.Control.extend({
        onAdd: ()=>{
            globalMesDom = L.DomUtil.create('div', 'message');
            globalMesDom.setAttribute('id', 'detailBox');
            globalMesDom.style.padding = '3px 3px 3px 3px';
            globalMesDom.style.border = '2px solid #fff';
            globalMesDom.style.borderRadius = '5px';
            globalMesDom.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            let legendList = '<p class="city">各市驱动因素</p>';
            globalMesDom.innerHTML = legendList;
            return globalMesDom;
        },
        onRemove: ()=>{}
    });
    L.control.legend = (opts)=>{
        return new L.Control.Legend(opts);
    };
    L.control.legend({
        position: 'topright'
    }).addTo(map);
}

export const loadGeojson = async (jsonUrl, mesUrl, map, label)=>{
    let geojson = await axios.get(jsonUrl);
    globalMes = await axios.get(mesUrl);
    globalMes = globalMes.data;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    globalGeojson = L.geoJSON(geojson.data, {
        style: (feature)=>{
            return {
                fillColor: color(label[feature.properties.adcode]),
                fillOpacity: 0.8,
                weight: 0.5,
                color: '#fff'
            };
        },
        onEachFeature: bindEventOnFeature
    }).addTo(map);
}
export const markCity = (latLon, map, lisaMap)=>{
    const myCustomColour = '#583470';//连接的哪个因素，就显示该因素的颜色

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
    
    L.marker(latLon, {
        icon
    }).addTo(map);
    L.marker(latLon, {
        icon
    }).addTo(lisaMap);
}