import React, {useEffect} from 'react';
import PubSub from 'pubsub-js';

import {loadMap, loadGeojson, getColor, addMessageControl, loadLisaMap, markCity} from './Map.js';
import './Map.css';

export default function Map() {
  useEffect(()=>{
    let map = loadMap();
    let lisaMap = null;
    getColor('http://localhost:8080/2015detailMap.json').then((data)=>{
      loadGeojson('http://localhost:8080/map.geojson', 'http://localhost:8080/2001hoverMes.json', map, data.label);
      addMessageControl(map);
    });
    loadLisaMap('http://localhost:8080/map.geojson', 'http://localhost:8080/2001lisaMap.json', 'lisa').then((res)=>{
      lisaMap = res;
    });
    PubSub.subscribe('mark', (_, par)=>{
      markCity([par.lat, par.lon], map, lisaMap);
    });
  }, []);

  return (
    <div className='map' id='chinaMap'>
      <header className='title'>异质性视图</header>
      <div className="lisaMap" id='lisa'></div>
    </div>
  );
}