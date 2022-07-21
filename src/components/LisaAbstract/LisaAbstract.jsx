import React, {useEffect} from 'react';

import {initCanvas, drawAllCircle, drawChord} from './LisaAbstract.js';
import './LisaAbstract.css';

export default function LisaAbstract() {
    useEffect(()=>{
        let svg = initCanvas('lisaChange');
        drawAllCircle('lisaChange', svg, 2001, 2019, 'http://localhost:8080/ChinaProvince.json', 'http://localhost:8080/lisaabstract.json');
        drawChord(svg);
    }, []);
    return (
        <div className='lisaAbstract' id='lisaChange'>
            <header className='title'>总览视图</header>
        </div>
    );
}