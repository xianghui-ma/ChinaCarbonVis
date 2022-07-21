import React, {useEffect} from 'react';

import {drawSimilarityHeatmap} from './SimilarityMatrix.js';

import './SimilarityMatrix.css';

export default function SimilarityMatrix() {
  useEffect(()=>{
    drawSimilarityHeatmap('yearSimilarity', '');
  }, []);

  return (
    <div className='similarityMatrix' id='yearSimilarity'>
      {/* <header className='title'>Similarity View</header> */}
    </div>
  );
}