import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';
import {loadFactorChange, loadFactorLine} from './WordCloud.js';

import './WordCloud.css';

export default function WordCloud() {
    useEffect(()=>{
        loadFactorLine('factorChange', 'http://localhost:8080/2001factorChange.json');
        // loadFactorChange('factorChange', 'http://localhost:8080/factorChange.json');
        PubSub.subscribe('chooseYear', (_, year)=>{
            loadFactorLine('factorChange', `http://localhost:8080/${year}factorChange.json`);
        });
    });
    return (
        <section className='wordCloudBox'>
            <header className='title'>Socio-economic factors</header>
            <section className='wordcloud' id='factorChange'></section>
        </section>
    );
}
