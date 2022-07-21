import './App.css';

import Snapshoot from './components/Snapshoot/Snapshoot.jsx';
import WordCloud from './components/WordCloud/WordCloud.jsx';
import Heterogeneity from './components/Heterogeneity/Heterogeneity.jsx';
import AggregationReason from './components/AggregationReason/AggregationReason.jsx';
import LisaMap from './components/LisaMap/LisaMap.jsx';
import FunCollection from './components/FunCollection/FunCollection.jsx';

// import Header from './components/Header/Header.jsx';
// import Map from './components/Map/Map.jsx';
// import TrajectoryMap from './components/TrajectoryMap/TrajectoryMap.jsx';
// import MoranAbstract from './components/MoranAbstract/MoranAbstract.jsx';
// import MoranDetail from './components/MoranDetail/MoranDetail.jsx';
// import LisaAbstract from './components/LisaAbstract/LisaAbstract.jsx';
// import ClusterScatter from './components/ClusterScatter/ClusterScatter.jsx';
// import SimilarityMatrix from './components/SimilarityMatrix/SimilarityMatrix.jsx';
// import GwrCof from './components/GwrCof/GwrCof.jsx';
// import LisaClusterTopology from './components/LisaClusterTopology/LisaClusterTopology.jsx';
// import GwrMessage from './components/GwrMessage/GwrMessage.jsx';
// import DetailMap from './components/DetailMap/DetailMap.jsx';

function App() {
return (
    <section className="app">
        <Snapshoot/>
        <WordCloud/>
        <LisaMap/>
        <FunCollection/>
        <Heterogeneity/>
        <AggregationReason/>
    </section>
);
}

export default App;