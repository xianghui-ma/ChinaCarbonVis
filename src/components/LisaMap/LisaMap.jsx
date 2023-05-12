import React, {useEffect, useRef} from 'react';
import PubSub from 'pubsub-js';

import {loadMap, addHeter, markParallelCity, loadVoronoiLisa, loadGwrChart} from './LisaMap.js';
import './LisaMap.css';

export default function LisaMap() {
    const heterLayer = useRef({});
    const cityPoint = useRef([]);
    const lisaLayer = useRef(null);
    const yearStore = useRef(2001);
    const chartLayer = useRef(null);
    useEffect(()=>{
        const map = loadMap('chinaMap');
        loadVoronoiLisa(map, 'http://localhost:8080/voronoi.geojson', 'http://localhost:8080/2001lisaMap.json').then((res)=>{
            lisaLayer.current = res;
        });
        // loadGwrChart(map);
        // loadLisa('http://localhost:8080/map.geojson', 'http://localhost:8080/2001lisaMap.json', map).then((res)=>{
        //     lisaLayer.current = res;
        // });
        PubSub.subscribe('addClu', (_, value)=>{
            addHeter(value, 'http://localhost:8080/voronoi.geojson', map, heterLayer.current).then(()=>{
                loadGwrChart(map, `http://localhost:8080/${yearStore.current}hoverMes.json`, 'http://localhost:8080/geoCor.json', value).then((res)=>{
                    chartLayer.current = res;
                });
            });
        });
        PubSub.subscribe('delClu', (_, value)=>{
            heterLayer.current[value.cluNum].remove();
            heterLayer.current[value.cluNum] = null;
            chartLayer.current.remove();
            chartLayer.current = null;
        });
        PubSub.subscribe('markSelectedCity', (_, value)=>{
            markParallelCity(value, map, 'http://localhost:8080/geoCor.json', cityPoint.current);
        });
        PubSub.subscribe('chooseYear', (_, value)=>{
            yearStore.current = value;
            lisaLayer.current.remove();
            loadVoronoiLisa(map, 'http://localhost:8080/voronoi.geojson', `http://localhost:8080/${value}lisaMap.json`).then((res)=>{
                lisaLayer.current = res;
            });
        });
    }, []);

    return (
        <section className='LisaMapBox'>
            <section className='southchinasea' id='southsea'></section>
            <header className='title'>City clusters of CO2</header>
            <section className='lisaMap' id='chinaMap'></section>
        </section>
    );
}