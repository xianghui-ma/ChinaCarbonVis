import axios from "axios";
import * as echarts from 'echarts';

export const drawCurve = async (containerId, dataUrl)=>{
    let res = await axios.get(dataUrl);
    res = res.data;
    let colorCol = ['#37A2DA','#e06343','#37a354','#b55dba','#b5bd48','#8378EA','#96BFFF', 'orange'];
    let chart = echarts.init(document.getElementById(containerId));
    let legendData = [];
    let series = [];
    let clusterNum = 0;
    for(let key in res){
        legendData.push(key.toLocaleUpperCase());
        clusterNum = res[key].length;
        series.push({
            name: key.toLocaleUpperCase(),
            type: 'line',
            symbol: 'circle',
            symbolSize: 10,
            itemStyle:{
                color: (par)=>{
                    return colorCol[par.dataIndex]
                }
            },
            data: res[key]
        });
    }
    let xaisData = [];
    for(let i = 1; i<= clusterNum; i++){
        xaisData.push('C' + i);
    }
    chart.setOption({
        legend: {
            data: legendData,
            top: 'bottom',
            textStyle: {
                color: '#000',
                fontWeight: 600,
            },
        },
        grid: {
            left: 0,
            right: '3%',
            top: '3%',
            bottom: '6%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xaisData
        },
        yAxis: {
            type: 'value'
        },
        series
    }, true);
}