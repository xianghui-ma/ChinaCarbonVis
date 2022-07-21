import * as echarts from 'echarts';
import axios from 'axios';
import * as d3 from "d3";

export const drawFactorValue = async (containerId, factorUrl, year, cityMapUrl)=>{
    let factor = await axios.get(factorUrl);
    let cityMap = await axios.get(cityMapUrl);
    let lisa = await axios.get('http://localhost:8080/' + year + 'lisaMap.json');
    factor = factor.data[year];
    cityMap = cityMap.data[year];
    lisa = lisa.data;
    let keys = Object.keys(factor);
    const container = d3.select('#' + containerId);
    container._groups[0][0].innerHTML = '';
    const color = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    for(let i = 0; i < keys.length; i++){
        echarts.init(container.append('section').attr('class', 'factorItem').style('flex-basis', (1 / keys.length) * 100 + '%')._groups[0][0]).setOption({
            title: {
                text: keys[i],
                right: 0,
                textStyle: {
                    color:'#777',
                    fontSize: 12
                }
            },
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            },
            xAxis: {
                type: 'category',
                show: false,
                data: []
            },
            yAxis: {
                type: 'value',
                show: false
            },
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        color: (p)=>{
                            return color[lisa[cityMap[p.dataIndex]].lisa];
                        }
                    },
                    data: factor[keys[i]]
                }
            ]
        }, true);
    }
}