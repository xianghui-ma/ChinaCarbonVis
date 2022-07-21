import React, {useEffect} from 'react';
import * as d3 from "d3";
import axios from "axios";

import {loadMap, drawTrajectoryDomContainer, addNodeGraph, drawdrawTrajectoryLine} from './TrajectoryMap.js';
import './TrajectoryMap.css';

export default function TrajectoryMap() {
  useEffect(()=>{
    let map = loadMap();
    axios.get('http://localhost:8080/gravityCenter').then((data)=>{
      drawdrawTrajectoryLine( data.data.pcgdp, map);
    });
    // drawdrawTrajectoryLine( [[38.56, 110.20],[32.56, 108.20]], map);
    // drawTrajectoryDomContainer(map);
    // let svg = d3.select("#test").append("svg").attr('width', 70).attr('height', 70);
    // addNodeGraph(35, 25, 15, 'orange', svg, 35, 35, {baseLineValue: [5, 25, 50], rate: [0.3, 0.2, 0.1, 0.4]}, d3.scaleOrdinal(d3.schemeCategory20));
  }, []);
  return (
    <div className='trajectoryMap' id='traMap'>
      <header className='title'>关系视图</header>
    </div>
  );
}