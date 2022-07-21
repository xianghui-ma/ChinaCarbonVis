import React, {useEffect} from 'react';

import {drawCurve} from './GwrCof.js';
import './GwrCof.css';

export default function GwrCof() {
    useEffect(()=>{
        drawCurve('curve', 'http://localhost:8080/2015clusterCurve.json');
    }, []);
    return (
        <div className='cofCurve' id='curve'></div>
    );
}