import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {drwaCityFactor, drawFactorValueItem} from './TimeReason.js';

import './TimeReason.css';

export default function TimeReason() {
    useEffect(()=>{
        drwaCityFactor('selectedFactor', 110000, 'http://localhost:8080/factorValue.json');
        drawFactorValueItem('http://localhost:8080/factorValueItem.json' ,'factorValue', 110000);
        PubSub.subscribe('chooseMarkCity', (_, value)=>{
            drwaCityFactor('selectedFactor', value, 'http://localhost:8080/factorValue.json');
            drawFactorValueItem('http://localhost:8080/factorValueItem.json' ,'factorValue', value);
        });
    }, []);
    return (
        <section className='funCollection' id='timeReasonContainer'>
            <section id='selectedFactor'></section>
            <section id='factorValue'></section>
        </section>
    );
}