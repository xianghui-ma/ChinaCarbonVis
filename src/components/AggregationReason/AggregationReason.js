import * as echarts from 'echarts';
import axios from 'axios';

export const drawEconomyGraph = async (containerId, dataUrl, chinaUrl)=>{
    let graph = await axios.get(dataUrl);
    let china = await axios.get(chinaUrl);
    const color = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9'};
    graph = graph.data;
    china = china.data;
    echarts.registerMap('china', china);
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        legend: [
            {
                selectedMode: 'single',
                orient: 'vertical',
                right: 30,
                bottom: 30,
                data: graph.categories.map(function (a) {
                    a.itemStyle = {
                        color: color[a.name]
                    }
                    return a;
                })
            }
        ],
        tooltip: {},
        // geo: {
        //     show: true,
        //     roam: true,
        //     map: 'china',
        //     center: [116.4133837, 39.91092455],
        //     zoom: 20,
        //     itemStyle: {
        //         areaColor: 'transparent',
        //         borderColor: 'transparent'
        //     }
        // },
        series: [
            {
                // coordinateSystem: 'geo',
                layout: 'force',
                type: 'graph',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: true,
                    position: 'right'
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    }, true);
}

export const drawBindGrap = async (containerId, categoriesUrl, aggReasonURL, year)=>{
    const nodeType = ['HH', 'LL', 'HL', 'LH'];
    const color = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9'};
    const factorShap = ['pin', 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'arrow'];
    let legendData = [];
    let categories = await axios.get(categoriesUrl);
    let link = await axios.get(aggReasonURL);
    link = link.data;
    categories = categories.data[year]['factors'];
    let categoriesArr = [];
    categories.forEach((item)=>{
        if(item.flag !== 0){
            categoriesArr.push({name: item.name.toUpperCase()});
            legendData.push({name: item.name.toUpperCase(), itemStyle: {color: '#999'}});
        }
    });
    categoriesArr.unshift({name: 'CITY'});
    legendData.unshift({name: 'CITY', itemStyle: {color: '#999'}});
    legendData.forEach((item, index)=>{
        item.icon = factorShap[index];
    });
    let nodes = [];
    let nodeLocMap = {};
    nodeType.forEach((type)=>{
        categoriesArr.forEach((cate, index)=>{
            nodeLocMap[cate.name + type] = nodes.push({id: cate.name + type, category: index, name: cate.name + '-' + type, symbolSize: 20, symbol: factorShap[index], itemStyle: {color: color[type]}}) - 1;
        });
    });
    let edge = [];
    for(let key in link){
        let keyArr = key.split('-');
        if(nodeLocMap[keyArr[1]]){
            edge.push({
                source: keyArr[0],
                target: keyArr[1],
                lineStyle: {
                    width: parseInt(link[key]),
                    color: color[keyArr[1].substring(keyArr[1].length - 2)]
                }
            });
        }
    }
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        legend: [
            {
                data: legendData,
                orient: 'vertical',
                align: 'right',
                right: '2%',
                bottom: '25%',
                itemWidth: 15
            }
        ],
        series: [
            {
                type: 'graph',
                layout: 'circular',
                data: nodes,
                links: edge,
                categories: categoriesArr,
                roam: true,
                lineStyle: {
                    curveness: 0.3
                }
            }
        ]
    }, true);
}