import * as echarts from 'echarts';
import axios from 'axios';
import PubSub from 'pubsub-js';

const tagColor = {fv: '#ee6666', pcra: '#9a60b4', is: '#fc8452', pv: '#73c0de', prsi: '#ea7ccc', bus: '#5470c6', pd: '#91cc75', pgs: '#fac858', pcgdp: '#3ba272'}

export const filterNodes = (filterKeyArr, chart, chartOptions)=>{
    let factorKey = [];
    if(filterKeyArr.factorType.length !== 0){
        filterKeyArr.factors.forEach((factor)=>{
            filterKeyArr.factorType.forEach((type)=>{
                factorKey.push(factor + '-' + type);
            });
        });
    }else{
        factorKey = filterKeyArr.factors;
    }
    let nodes = [];
    if(filterKeyArr.cityType.length !== 0){
        chartOptions.nodes.forEach((node)=>{
            if(filterKeyArr.cityType.indexOf(node.value) !== -1 || node.category !== 10){
                nodes.push(node);
            }
        });
    }else{
        nodes = chartOptions.nodes;
    }
    let result = [];
    if(factorKey.length !== 0){
        nodes.forEach((node)=>{
            if(factorKey.indexOf(node.value) !== -1 || factorKey.indexOf(node.id) !== -1 || node.category === 10){
                result.push(node);
            }
        });
    }else{
        result = nodes;
    }
    
    chart.setOption({
        series: [
            {
                type: 'graph',
                layout: 'force',
                roam: true,
                edgeSymbol: ['none', 'arrow'],
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    },
                    lineStyle: {
                        width: 10
                    }
                },
                draggable: true,
                data: result,
                categories: chartOptions.categories,
                lineStyle: {
                    color: 'rgb(143, 170, 220)',
                    width:1,
                    opacity: 1,
                    curveness: 0.2
                },
                force: {
                    edgeLength: 30,
                    repulsion: 100,
                    gravity: 0.2,
                    // friction: 0.1,
                    layoutAnimation: true
                },
                edges: chartOptions.links
            }
        ]
      }, true);
}

export const showFilterBox = ()=>{
    document.getElementById('showButton').style.display = 'none';
    document.getElementById('filter').style.display = 'block';
}

export const closeFilterBox = ()=>{
    document.getElementById('filter').style.display = 'none';
    document.getElementById('showButton').style.display = 'block';
}

export const drawTopology = async (dataUrl, corDataUrl, containerId)=>{
    let res = await axios.get(dataUrl);
    let geoCor = await axios.get(corDataUrl);
    res = res.data;
    geoCor = geoCor.data;
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        // legend: [
        //     {
        //         icon: 'circle',
        //         orient: 'vertical',
        //         right: 0,
        //         top: 30,
        //         data: res.categories.map(function (a) {
        //             return a.name;
        //         })
        //     }
        // ],
        series: [
            {
                type: 'graph',
                layout: 'force',
                edgeSymbol: ['none', 'none'],
                roam: true,
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    },
                    lineStyle: {
                        width: 10
                    }
                },
                draggable: true,
                data: res.nodes.map(function (node) {
                    if(node.category <= 9){
                        node.symbolSize = 12;
                        node.itemStyle = {
                            color: 'rgb(143, 170, 220)'
                        }
                        node.label={show:true,position:'inside'};
                    }else{
                        node.symbolSize = 6;
                        node.itemStyle = {
                            color: 'rgb(188, 219, 167)'
                        }
                        node.label={show:true,position:'inside'};
                    }
                    return node;
                }),
                lineStyle: {
                    color: 'rgb(143, 170, 220)',
                    width:1,
                    opacity: 0.1,
                    curveness: 0.2
                },
                categories: res.categories,
                force: {
                    edgeLength: 30,
                    repulsion: 100,
                    gravity: 0.2,
                    // friction: 0.1,
                    layoutAnimation: true
                },
                edges: res.links
            }
        ]
      }, true);
      chart.on('click', (params)=>{
          console.log(params);
          PubSub.publish('mark', geoCor[params.data.id]);
            // console.log(geoCor[params.data.id]);
      });
      return {
          res,
          chart
      };
}
export const nodeHidden = (e)=>{
    console.log(e.target.checked);
}
export const nodeLabel = (e)=>{
    console.log(e.target.checked);
}