import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {drawPredictionChart} from './CarbonPrediction.js';

import './CarbonPrediction.css';

export default function CarbonPrediction() {
    useEffect(()=>{
        drawPredictionChart('predictionChart', 'http://localhost:8080/prediction.json', 110000);
        PubSub.subscribe('chooseMarkCity', (_, value)=>{
            drawPredictionChart('predictionChart', 'http://localhost:8080/prediction.json', value);
        });
    }, []);
    return (
        <section className='funCollection' id='predictionChart'></section>
    );
}