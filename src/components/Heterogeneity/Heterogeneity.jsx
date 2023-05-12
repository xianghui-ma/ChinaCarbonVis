import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {loadHeterogeneity} from './Heterogeneity.js';

import './Heterogeneity.css';

export default function Heterogeneity() {
    useEffect(()=>{
        loadHeterogeneity('http://localhost:8080/2001lisaMap.json', 'http://localhost:8080/2001hoverMes.json', 'http://localhost:8080/2001detailMap.json');
        PubSub.subscribe('chooseYear', (_, value)=>{
            loadHeterogeneity(`http://localhost:8080/${value}lisaMap.json`, `http://localhost:8080/${value}hoverMes.json`, `http://localhost:8080/${value}detailMap.json`);
        });
    }, []);
    return (
        <section className='heterogeneityBox'>
            <header className='title'>Clusters of heterogeneity</header>
            <section className='heterogeneity' id='circlePack'></section>
        </section>
    );
}