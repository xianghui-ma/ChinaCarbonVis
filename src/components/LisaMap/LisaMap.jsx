import React, {useEffect, useRef} from 'react';
import PubSub from 'pubsub-js';

import {loadMap, loadLisa, addHeter, markParallelCity} from './LisaMap.js';
import './LisaMap.css';

export default function LisaMap() {
    const heterLayer = useRef({});
    const cityPoint = useRef([]);
    const lisaLayer = useRef(null);
    useEffect(()=>{
        const map = loadMap('chinaMap');
        loadLisa('http://localhost:8080/map.geojson', 'http://localhost:8080/2001lisaMap.json', map).then((res)=>{
            lisaLayer.current = res;
        });
        PubSub.subscribe('addClu', (_, value)=>{
            addHeter(value, 'http://localhost:8080/map.geojson', map, heterLayer.current);
        });
        PubSub.subscribe('delClu', (_, value)=>{
            heterLayer.current[value.cluNum].remove();
            heterLayer.current[value.cluNum] = null;
        });
        PubSub.subscribe('markSelectedCity', (_, value)=>{
            markParallelCity(value, map, 'http://localhost:8080/geoCor.json', cityPoint.current);
        });
        PubSub.subscribe('chooseYear', (_, value)=>{
            lisaLayer.current.remove();
            loadLisa('http://localhost:8080/map.geojson', `http://localhost:8080/${value}lisaMap.json`, map).then((res)=>{
                lisaLayer.current = res;
            });
        });
    }, []);

    return (
        <section className='LisaMapBox'>
            <header className='title'>碳排放城市集群</header>
            <section className='lisaMap' id='chinaMap'></section>
        </section>
    );
}