import React, {useEffect} from 'react';

import {drawMesBar} from './GwrMessage.js';

import './GwrMessage.css';

export default function GwrMessage() {
    useEffect(()=>{
        drawMesBar('message', 'http://localhost:8080/2015gwr.json');
    }, []);
    return (
        <div className='gwrMes'>
            {/* <header className='title'>Gwr View</header> */}
            <div className="mesBox" id="message"></div>
        </div>
    );
}