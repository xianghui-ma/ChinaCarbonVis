import React, {useEffect} from 'react';

import {drawCityTable, drawParallel} from './MoranAbstract.js';
import './MoranAbstract.css';

export default function MoranAbstract() {
  useEffect(()=>{
    // drawFactors('factorsContainer', '');
    drawParallel('changeParallel', 'http://localhost:8080/parallel.json');
    drawCityTable('cityTable');
  }, []);
  return (
    <div className='moranAbstract' id='forceCluster'>
      {/* <header className='title'>时变视图</header> */}
      <div className="areaChange" id='changeParallel'></div>
      <div className="cityList" id='cityTable'></div>
      {/* <div className="factors" id='factorsContainer'></div> */}
    </div>
  );
}