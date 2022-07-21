import React, {useEffect} from 'react';

import {loadSnapshootBox} from './Snapshoot.js';

import './Snapshoot.css';

export default function Snapshoot() {
  useEffect(()=>{
    loadSnapshootBox('http://localhost:8080/ChinaProvince.json', 'http://localhost:8080/lisaabstract.json', 'http://localhost:8080/similiarty.json');
  }, []);

  return (
    <section className='snapshootBox'>
        <header className='title'>集群快照</header>
        <section className='snapshoot'></section>
    </section>
  );
}
