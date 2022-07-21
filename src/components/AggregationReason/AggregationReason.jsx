import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {drawBindGrap} from './AggregationReason.js';

import './AggregationReason.css';

export default function AggregationReason() {
    useEffect(()=>{
        drawBindGrap('factorRelation', 'http://localhost:8080/lisaabstract.json', 'http://localhost:8080/2001aggReason.json', 2001);
        PubSub.subscribe('chooseYear', (_, value)=>{
            drawBindGrap('factorRelation', 'http://localhost:8080/lisaabstract.json', `http://localhost:8080/${value}aggReason.json`, value);
        });
    }, []);
    return (
        <section className='aggregationReasonBox'>
            <header className='title'>碳排放城市群成因</header>
            <section className='aggregationReason' id='factorRelation'></section>
        </section>
    );
}
