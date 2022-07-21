import React, {useEffect} from 'react';

import {loadMap} from './DetailMap.js';

import './DetailMap.css';

export default function DetailMap() {
    useEffect(()=>{
        loadMap();
    }, []);
    return (
        <div className='mapBox' id='detailMap'></div>
    );
}
