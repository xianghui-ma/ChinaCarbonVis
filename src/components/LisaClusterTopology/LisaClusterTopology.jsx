import React, {useEffect, useRef} from 'react';
import {Space} from 'antd';
import {FilterOutlined, CloseOutlined} from '@ant-design/icons';
import {Checkbox} from 'antd';

import {drawTopology, showFilterBox, closeFilterBox, filterNodes, nodeHidden, nodeLabel} from './LisaClusterTopology.js';

import 'antd/dist/antd.css';
import './LisaClusterTopology.css';

export default function LisaClusterTopology() {
    const classType = ['HH', 'LL', 'HL', 'LH', 'NS'];
    const factorOption = ['fv','is','pcra','pv','prsi','bus','pd','pgs','pcgdp'];
    const chartStore = useRef(null);
    const dataStore = useRef(null);
    const filterKeyArr = {
        cityType: [],
        factors: [],
        factorType: []
    };
    useEffect(()=>{
        drawTopology('http://localhost:8080/2015topology.json', 'http://localhost:8080/geoCor.json', 'topology').then((data)=>{
            chartStore.current = data.chart;
            dataStore.current = data.res;
        });
    }, []);
    return (
        <div className='topologyContainer'>
            <header className='title'>关系视图</header>
            <div className="filterIcon" id='showButton' onClick={showFilterBox}>
                <Space>
                    <FilterOutlined/>
                </Space>
            </div>
            <div className="filterBox" id='filter'>
                <div className="closeIcon" onClick={closeFilterBox}>
                    <Space>
                        <CloseOutlined/>
                    </Space>
                </div>
                <div className="cityFilter">
                    <div className="city">
                        <p className='cityType'>城市类型</p>
                        <Checkbox.Group options={classType} style={{backgroundColor: '#fff', width: '100%'}} onChange={(selectedCity)=>{
                            filterKeyArr.cityType = selectedCity;
                            filterNodes(filterKeyArr, chartStore.current, dataStore.current);
                        }}/>
                    </div>
                    <div className='influences'>
                        <p className='factor'>影响因素</p>
                        <Checkbox.Group options={factorOption} style={{backgroundColor: '#fff', width: '100%', borderBottom:'1px solid #000'}} onChange={(selectFactor)=>{
                            filterKeyArr.factors = selectFactor;
                            filterNodes(filterKeyArr, chartStore.current, dataStore.current);
                        }}/>
                        <Checkbox.Group options={classType} style={{backgroundColor: '#fff', width: '100%'}} onChange={(selectOpt)=>{
                            filterKeyArr.factorType = selectOpt;
                            filterNodes(filterKeyArr, chartStore.current, dataStore.current);
                        }}/>
                    </div>
                    <div>
                        <p className='nodeConfig'>节点设置</p>
                        <div className='optionBox'>
                            <Checkbox onChange={nodeHidden}>隐藏无边节点</Checkbox>
                            <Checkbox onChange={nodeLabel}>显示节点标签</Checkbox>
                        </div>
                    </div>
                </div>
            </div>
            <div id="topology" className='chartBox'></div>
        </div>
    );
}