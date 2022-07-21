import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {drawParallel} from './CityLisaChange.js';

export default function CityLisaChange() {
    useEffect(()=>{
        drawParallel('parallelContainer', 'http://localhost:8080/parallel.json', 'http://localhost:8080/2001lisaMap.json');
        PubSub.subscribe('chooseYear', (_, value)=>{
            drawParallel('parallelContainer', 'http://localhost:8080/parallel.json', `http://localhost:8080/${value}lisaMap.json`);
        });
    }, []);
    return (
        <section className='funCollection' id='parallelContainer'></section>
    );
}
