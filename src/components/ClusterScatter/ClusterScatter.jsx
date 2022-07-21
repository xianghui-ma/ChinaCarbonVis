import React, {useEffect} from 'react';

import {drawClusterScatter} from './ClusterScatter.js';

import './ClusterScatter.css';

export default function ClusterScatter() {
  useEffect(()=>{
    drawClusterScatter('cluster', 'http://localhost:8080/2015cluster.json');
  }, []);
  return (
    <div className='clusterScatter'>
      <header className='title'>Cluster View</header>
      <div id="cluster" className='clusterContainer'></div>
    </div>
  );
}