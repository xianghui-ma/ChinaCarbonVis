import React, {useEffect} from 'react';

import {loadFactorChange} from './WordCloud.js';

import './WordCloud.css';

export default function WordCloud() {
    useEffect(()=>{
        loadFactorChange('factorChange', 'http://localhost:8080/factorChange.json');
    });
    return (
        <section className='wordCloudBox'>
            <header className='title'>驱动因素时变</header>
            <section className='wordcloud' id='factorChange'></section>
        </section>
    );
}
