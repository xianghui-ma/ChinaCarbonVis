import * as echarts from 'echarts';
import axios from 'axios';
import PubSub from 'pubsub-js';

export const drawParallel = async (containerId, parallelUrl, lisaUrl)=>{
    const year = [2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019];
    const chart = echarts.init(document.getElementById(containerId));
    const colorMap = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    let data = await axios.get(parallelUrl);
    let lisa = await axios.get(lisaUrl);
    data = data.data;
    lisa = lisa.data;
    chart.setOption({
        brush: {
            toolbox: ['clear'],
            brushLink: 'all',
            inBrush: {
                opacity: 1
            },
            outOfBrush: {
                opacity: 0
            }
        },
        parallelAxis: year.map((item, index) => {
            return {
                dim: index,
                name: item,
                type: 'category',
                data: ['NS', 'LH', 'HL', 'LL', 'HH'],
                axisLabel: {
                    formatter: item === 2019 ? (value) => {
                        return value;
                    } : () => {}
                }
            };
        }),
        parallel: {
            left: 15,
            right: '3%',
            bottom: '8%',
            top: 10,
            parallelAxisDefault: {
                nameLocation: 'start',
                axisLabel: {
                    color: '#000'
                }
            }
        },
        series: {
            type: 'parallel',
            smooth: true,
            lineStyle: {
                color: (item)=>{
                    return colorMap[lisa[data.adcode[item.dataIndex]].lisa];
                },
                width: 1,
                opacity: 1
            },
            data: data.list
        }
    }, true);
    chart.on('axisareaselected', function () {
        let series0 = chart.getModel().getSeries()[0];
        let indices0 = series0.getRawIndicesByActiveState('active');
        let cityList = indices0.map((item)=>{
            return data.adcode[item];
        });
        PubSub.publish('cityList', cityList);
    });
}