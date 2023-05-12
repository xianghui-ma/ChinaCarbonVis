import React, {useEffect} from 'react';
import {NavLink, Route, Switch, Redirect} from 'react-router-dom';
import PubSub from 'pubsub-js';

import CityLisaChange from '../CityLisaChange/CityLisaChange.jsx';
import CityFactor from '../CityFactor/CityFactor.jsx';
import TimeReason from '../TimeReason/TimeReason.jsx';
import CarbonPrediction from '../CarbonPrediction/CarbonPrediction.jsx';

import './FunCollection.css';

let cities = null;

export default function FunCollection() {
    useEffect(()=>{
        PubSub.subscribe('cityList', (_, cityList)=>{
            cities = cityList;
        });
    }, []);
    return (
        <section className='funCollectionBox'>
            <header className='title'>
                <section>
                    <NavLink to='/time' className='tabItem' activeClassName='selectedTab'>Timely varying curves</NavLink>
                    {/* <NavLink to='/factor' className='tabItem' activeClassName='selectedTab'>城市驱动因素</NavLink> */}
                    <NavLink to='/timeReason' className='tabItem' activeClassName='selectedTab'>Time-varying reason</NavLink>
                    {/* <NavLink to='/prediction' className='tabItem' activeClassName='selectedTab'>碳排放预测</NavLink> */}
                </section>
                <section>
                    <button type="button" className='markCity' id='mark' onClick={()=>{
                        PubSub.publish('markSelectedCity', cities);
                    }}>Mark</button>
                </section>
            </header>
            <Switch>
                <Route path='/time' component={CityLisaChange}/>
                {/* <Route path='/factor' component={CityFactor}/> */}
                <Route path='/timeReason' component={TimeReason}/>
                {/* <Route path='/prediction' component={CarbonPrediction}/> */}
                <Redirect to='time'></Redirect>
            </Switch>
        </section>
    );
}
