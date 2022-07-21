import * as echarts from 'echarts';
import axios from 'axios';
import * as d3 from "d3";

export const drwaCityFactor = async (containerId, adcode, factorValueUrl)=>{
    const factor = ['BUS', 'PD', 'PGS', 'FV', 'PV', 'PCGDP', 'IS', 'PCRA', 'PRSI'];
    const color = ['#F28482', '#8fbfb8', '#f7cb65', '#F5CAC3', '#A5CCA9', '#F7EDE2', '#936989', '#9FE7F5', '#95BCCC'];
    let factorValue = await axios.get(factorValueUrl);
    factorValue = factorValue.data;
    const chart = echarts.init(document.getElementById(containerId));
    let series = [];
    let index = 0;
    for(let key in factorValue){
        series.push({
            name: key.toLocaleUpperCase(),
            type: 'line',
            stack: 'Total',
            itemStyle: {
                color: color[index],
                opacity: 1
            },
            emphasis: {
                focus: 'series'
            },
            data: factorValue[key][adcode]
        });
        index++;
    }
    chart.setOption({
        legend: {
            data: factor
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '0%',
            top: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['2001', '2003', '2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019']
            }
        ],
        yAxis: {
            show: false
        },
        series
    }, true);
}

export const drawFactorValueItem = async (dataUrl, containerId, adcode)=>{
    let data = await axios.get(dataUrl);
    const color = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#ddd'};
    data = data.data;
    let keys = Object.keys(data)
    let wrapper = d3.select('#' + containerId);
    wrapper._groups[0][0].innerHTML = '';
    keys.forEach((year, index)=>{
        let chart = echarts.init(wrapper.append('section').attr('class', 'factorValueItem')._groups[0][0]);
        let factor = data[year][adcode];
        let serie = []
        for(let key in factor){
            serie.push({
                name: key,
                value: 10,
                itemStyle: {
                    color: color[factor[key]]
                }
            });
        }
        chart.setOption({
            tooltip:{},
            series: [
                {
                    type: 'treemap',
                    breadcrumb: {
                        show: false
                    },
                    label: {
                        color: '#000',
                        fontSize: 10
                    },
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    roam: false,
                    data: serie
                }
            ]
        }, true);
    });
}