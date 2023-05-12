import L from 'leaflet';
import axios from 'axios';
import PubSub from 'pubsub-js';
import 'leaflet-dvf';

export const loadMap = (containerId)=>{
    let color = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    let map = L.map(containerId, {
        zoomControl: true
    }).setView([38.56, 104.20], 4);
    // https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTEzY2YwbDBwMnZzanV6ZnB2NmVxIn0.nCgfpyifVAgg4i5g8ahMOQ
    // https://webapi.amap.com/maps?v=1.4.15&key=f29e17bbb6439d7b3b49302247ad4ace
    // http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}
    L.tileLayer("http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map);

    let legend = L.control({position: 'topright'});
    legend.onAdd = (map)=>{
        let div = L.DomUtil.create('div', 'legend');
        for(let type in color){
            div.innerHTML += `<i style="background:${color[type]}"></i>${type} City Cluster<br>`
        }
        return div;
    }
    legend.addTo(map);
    return map;
}
export const loadGwrChart = async (map, dataUrl, geoCorUrl, cities)=>{
    let data = await axios.get(dataUrl);
    let cor = await axios.get(geoCorUrl);
    data = data.data;
    cor = cor.data;
    let temp = null;
    let options = null;
    let chartsLayer = [];
    cities.adcode.map((adcode, index)=>{
        temp = data[adcode];
        options = {
            weight: 1,
            color: '#000',
            data: {},
            chartOptions: {}
        };
        delete temp['city'];
        let keyUpper = '';
        for(let key in temp){
            keyUpper = key.replace('cof_', '').toLocaleUpperCase();
            options.data[keyUpper] = temp[key];
            options.chartOptions[keyUpper] = {
                fillColor: '#FEE5D9',
                minValue: -1,
                maxValue: 1,
                maxHeight: 30,
                displayText: (value)=>{
                    return value.toFixed(2);
                }
            };
        }
        chartsLayer.push(new L.BarChartMarker(new L.LatLng(cor[adcode]['lat'], cor[adcode]['lon']), options));
    });
    return map.addLayer(L.layerGroup(chartsLayer));
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
export const loadVoronoiLisa = async (map, mapUrl, lisaUrl)=>{
    const points = [[116.4133837, 39.91092455], [117.2095232, 39.09366784], [114.4690216, 38.05209711], [118.1864595, 39.63658372], [119.6085306, 39.9417481], [114.5456282, 36.63126273], [115.0316624, 37.07716685], [115.4714638, 38.87998777], [117.9693975, 40.95785601], [116.8455808, 38.31021514], [116.6905817, 39.54336666], [112.5563915, 37.87698903], [113.3064363, 40.08246872], [113.5876167, 37.86236085], [113.1225589, 36.20126837], [112.8585782, 35.49628459], [112.4393709, 39.33710837], [112.7595948, 37.69283941], [111.0133895, 35.03270691], [111.5255302, 36.0937419], [123.4710966, 41.68383007], [121.6216315, 38.91895367], [123.0013725, 41.1150536], [123.9643746, 41.88596959], [123.6925071, 41.49291646], [124.3615473, 40.00640871], [121.1325963, 41.1009315], [121.676408, 42.0280219], [123.2433664, 41.27416129], [122.0774901, 41.12587529], [123.7323652, 42.229948], [120.4574995, 41.57982086], [125.3306021, 43.8219535], [124.3564816, 43.17199357], [125.1504252, 42.89405501], [125.9466063, 41.7338158], [126.4296301, 41.93962721], [124.8314819, 45.14740419], [122.8455906, 45.62550436], [126.5416151, 45.80882583], [123.9245709, 47.35997719], [130.9756187, 45.30087232], [130.3044329, 47.35605616], [131.1653417, 46.6531859], [125.1086576, 46.59363318], [128.8475464, 47.73331846], [131.0115446, 45.77630032], [129.6395398, 44.55624571], [127.5354899, 50.25127231], [126.9753569, 46.66003218], [121.4805389, 31.23592904], [118.8024217, 32.06465289], [120.3185833, 31.49880973], [117.2905754, 34.21266655], [119.9814847, 31.81579565], [120.5924122, 31.30356407], [120.9015917, 31.98654943], [119.2286213, 34.60224953], [120.1675443, 33.35510092], [119.4194189, 32.40067694], [119.4304894, 32.19471592], [119.9295663, 32.46067505], [120.2155118, 30.25308298], [121.6285725, 29.86603305], [120.7635518, 30.75097483], [120.0945166, 30.89896394], [120.5854785, 30.03636931], [119.6534362, 29.08463939], [122.2135563, 29.99091168], [121.4274347, 28.66219406], [119.9295731, 28.47327818], [117.2334427, 31.82657783], [118.5135796, 31.6762656], [116.8045373, 33.9616563], [117.8184768, 30.95123324], [117.0636039, 30.53095657], [118.3454373, 29.72188979], [118.3394061, 32.26127087], [115.8204361, 32.89606099], [116.9705439, 33.65209533], [116.5264097, 31.74145082], [117.498421, 30.67088379], [119.3034698, 26.08042942], [118.6824463, 24.87995233], [117.6535765, 24.51892979], [118.1843695, 26.64777287], [117.0234476, 25.08121984], [119.5545107, 26.67224171], [115.8645894, 28.6894553], [117.1845764, 29.27424771], [113.8614964, 27.62839271], [116.0075349, 29.71134056], [117.0755754, 28.26578706], [114.9405034, 25.8351761], [115.0005107, 27.11972683], [114.4235637, 27.82085642], [116.3645388, 27.95489225], [117.9494596, 28.46062592], [117.1263994, 36.6565542], [120.3894552, 36.0722275], [118.0614525, 36.81908568], [117.3305419, 34.81599405], [118.6813849, 37.43964183], [121.4544154, 37.47003838], [119.1683779, 36.71265155], [116.5936123, 35.42017739], [117.0944948, 36.20585804], [122.127541, 37.51643055], [119.5334154, 35.422839], [118.363533, 35.11067124], [116.3655567, 37.44130845], [115.9915878, 36.46275819], [117.977404, 37.3881962], [113.6314192, 34.75343885], [114.3145926, 34.80288581], [112.4594213, 34.62426278], [113.1995286, 33.77205075], [114.3995004, 36.10594098], [114.3035936, 35.75235741], [113.9336005, 35.30963993], [113.2485478, 35.22096325], [113.8584755, 34.04143161], [114.0234208, 33.58771071], [111.2065332, 34.77832725], [112.5345013, 32.9965622], [115.6624493, 34.42020167], [114.0974828, 32.15301455], [114.0284708, 33.01784242], [114.3115816, 30.59846674], [115.0455329, 30.20520785], [110.8045296, 32.63506186], [111.2925492, 30.69744648], [114.9016074, 30.39657217], [112.206393, 31.04173258], [113.9225101, 30.93068923], [114.8784905, 30.45935886], [113.38945, 31.69651677], [112.9454732, 28.2348894], [113.1404708, 27.83356764], [112.9504642, 27.83570223], [112.5784472, 26.89957614], [113.1354894, 29.36317829], [110.4855325, 29.12281556], [112.361516, 28.55971118], [113.0214605, 25.77668327], [111.6194551, 26.42586412], [110.0085143, 27.5751609], [112.0015035, 27.7032086], [113.2714313, 23.13533631], [113.6035273, 24.81588128], [114.0645518, 22.54845664], [113.5825548, 22.27656465], [116.6885286, 23.35909172], [113.1285122, 23.02775875], [113.0885562, 22.58460388], [110.3655544, 21.27672344], [110.9315426, 21.66906403], [112.4714889, 23.05288877], [116.1295374, 24.29417753], [115.3815526, 22.79126304], [114.7074463, 23.74968437], [111.9884893, 21.86433973], [113.7584205, 23.02730841], [113.3994224, 22.52231467], [116.6294702, 23.66262319], [112.0515127, 22.92091197], [108.3734508, 22.8226066], [110.2035454, 25.24288572], [111.2855168, 23.48274528]];
    let colorMap = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    let shape = await axios.get(mapUrl);
    let lisa = await axios.get(lisaUrl);
    shape = shape.data;
    lisa = lisa.data;   
    points.forEach((item)=>{
        L.circle([item[1], item[0]], {
            color: '#f03',
            fillColor: '#f03',
            radius: 90
        }).addTo(map);
    });
    return L.geoJSON(shape, {
        style: (feature)=>{
            return {
                fillColor: colorMap[lisa[feature.properties.adcode].lisa],
                fillOpacity: 0.7,
                weight: 1,
                color: '#000'
            };
        },
        onEachFeature: (feature, layer)=>{
            layer.bindPopup(feature.properties.city);
            layer.on({
                mouseover: (e)=>{
                    e.target.openPopup();
                },
                mouseout: (e)=>{
                    e.target.closePopup();
                }
            });
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
                weight: 1,
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