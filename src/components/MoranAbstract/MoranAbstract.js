import * as echarts from 'echarts';
import axios from 'axios';
import { TableSheet } from '@antv/s2';
// export const drawFactors = async (containerId, dataUrl)=>{
//     let chart = echarts.init(document.getElementById(containerId));
//     let data = {'bus': [0.0, 0.0, 0.0, 0.0, 0.175, 0.153, 0.0, 0.0, 0.0, 0.0], 'pd': [0.186, 0.17, 0.0, 0.133, 0.0, 0.0, 0.0, 0.136, 0.377, 0.348], 'pgs': [0.0, 0.0, 0.0, -0.139, -0.151, -0.126, -0.153, -0.151, 0.0, 0.0], 'fv': [0.601, 0.621, 0.532, 0.566, 0.492, 0.556, 0.606, 0.492, 0.0, 0.0], 'pv': [0.0, 0.0, 0.218, 0.143, 0.156, 0.132, 0.0, 0.0, 0.0, 0.0], 'pcgdp': [0.0, 0.0, 0.0, 0.0, 0.132, 0.153, 0.285, 0.213, 0.31, 0.256], 'is': [0.175, 0.0, 0.236, 0.0, 0.0, 0.0, -0.151, -0.162, -0.192, 0.0], 'pcra': [0.0, 0.167, 0.173, 0.265, 0.138, 0.0, 0.178, 0.203, 0.0, 0.0], 'prsi': [0.0, 0.0, -0.141, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]};
//     let series = []
//     let factors = []
//     for(let factor in data){
//         factors.push(factor.toLocaleUpperCase());
//         series.push({
//             name: factor.toLocaleUpperCase(),
//             label: {
//                 fontSize: 8,
//                 color: '#000',
//                 show: true,
//                 rotate: 90,
//                 fontWeight: 800,
//                 formatter: (obj)=>{
//                     if(obj.value === 0){
//                         return '';
//                     }else{
//                         return obj.value.toFixed(1);
//                     }
//                 }
//             },
//             type: 'bar',
//             barGap: 0,
//             emphasis: {
//                 focus: 'series'
//             },
//             data: data[factor]
//         });
//     }
//     chart.setOption({
//         legend: {
//             data: factors,
//             top: 'bottom',
//             icon: 'circle',
//             textStyle: {
//                 color: '#000',
//                 fontWeight: 600,
//             },
//             padding: [5, 5, 0, 5]
//         },
//         grid:{
//             left: 5,
//             right: 5,
//             bottom: '15%',
//             top: 0
//         },
//         xAxis: {
//             show: true,
//             axisLine: {
//                 show: true,
//                 lineStyle: {
//                     color: '#000',
//                     width: 1
//                 }
//             },
//             nameTextStyle: {
//                 color: '#fff'
//             },
//             axisTick: {
//                 show: true,
//                 lineStyle: {
//                     width: 3
//                 }
//             },
//             type: 'category',
//             data: ['', '', '', '', '', '', '', '', '', '']
//         },
//         yAxis: {
//             type: 'value',
//             show: false,
//             min: 'dataMin',
//             max: 'dataMax'
//         },
//         series
//     });
// }

export const drawParallel = async (containerId, dataUrl)=>{
    let res = await axios.get(dataUrl);
    res = res.data;
    let chart = echarts.init(document.getElementById(containerId));
    let range = ['HHHH', 'HHLL', 'HHHL', 'HHLH', 'HHNS',
                'LLHH', 'LLLL', 'LLHL', 'LLLH', 'LLNS',
                'HLHH', 'HLLL', 'HLHL', 'HLLH', 'HLNS',
                'LHHH', 'LHLL', 'LHHL', 'LHLH', 'LHNS',
                'NSHH', 'NSLL', 'NSHL', 'NSLH', 'NSNS']
    let years = ['2001', '2003', '2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019']
    let parallelAxis = years.map((year, index)=>{
        return {
            dim: index,
            name: year,
            type: 'category',
            data: year === '2019' ? ['HH', 'LL', 'HL', 'LH', 'NS'] : range,
            axisLabel: {
                interval: year === '2019' ? 0 : 4,
                formatter:  year === '2019' ? (value)=>{
                  return value;
                } : ()=>{}
            }
        };
    });
    chart.setOption({
        parallelAxis,
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
                width: 2,
                color: '#5CACEE'
            },
            data: res
        }
    });
    chart.on('axisareaselected', function () {
        let series0 = chart.getModel().getSeries()[0];
        let indices0 = series0.getRawIndicesByActiveState('active');
        if(indices0.length !== 0){
            let cityArr = [];
            indices0.forEach((item)=>{
                cityArr.push(res[item][10]);
            });
            console.log(cityArr);
        }
    });
}
export const drawCityTable = (containerId)=>{
    // let data = [];
    // let data = [{city: '北京'},{city: '天津'},{city: '唐山'},{city: '保定'},{city: '沧州'},{city: '廊坊'},{city: '无锡'},{city: '苏州'},{city: '南通'},{city: '宁波'},{city: '嘉兴'},{city: '东营'},{city: '德州'}];
    let data = [{city: '济南'},{city: '烟台'},{city: '泰安'},{city: '聊城'}];
    const container = document.getElementById(containerId);
    const s2DataConfig = {
        fields: {
            columns: ['city'],
        },
        meta: [
            {
                field: 'city',
                name: '城市',
            }
        ],
        data,
    };

    const s2Options = {
        width: 118,
        height: 372
    };
    const s2 = new TableSheet(container, s2DataConfig, s2Options);
    s2.setThemeCfg({ name: 'gray' });
    s2.render();
}