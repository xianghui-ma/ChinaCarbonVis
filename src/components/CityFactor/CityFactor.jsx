import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {drawFactorValue} from './CityFactor.js';

export default function CityFactor() {
    useEffect(()=>{
        drawFactorValue('cityFactor', 'http://localhost:8080/factor.json', 2001, 'http://localhost:8080/factorCityMap.json');
        PubSub.subscribe('chooseYear', (_, value)=>{
            console.log(value);
            drawFactorValue('cityFactor', 'http://localhost:8080/factor.json', value, 'http://localhost:8080/factorCityMap.json');
        });
    }, []);
    return (
        <section className='funCollection' id='cityFactor'></section>
    );
}






