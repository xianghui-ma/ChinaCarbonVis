import * as echarts from 'echarts';
import axios from 'axios';

export const loadFactorLine = async (containerId, factorsUrl)=>{
    let factor = await axios.get(factorsUrl);
    factor = factor.data;
    let chart = echarts.init(document.getElementById(containerId));
    const data = [];
    const cityList = ['fv', 'pv', 'bus', 'pd', 'pgs', 'pcgdp', 'is', 'pcra', 'prsi'];
    let xAxis = [];
    let yAxis = [];
    let grid = [];
    let series = [];
    let title = [];
    cityList.forEach((item, index)=>{
      xAxis.push({
          show: false,
          data: factor['city'],
          gridIndex: index
      });
      yAxis.push({
          show: false,
          gridIndex: index
      });
      grid.push({
          left: 5,
          right: 5,
          top: index * 10 + '%',
          bottom: 100 - ((index + 1) * 10) + '%'
      });
      series.push({
        type: 'line',
        lineStyle: {
            color: '#C7756B'
        },
        areaStyle:{
            color: '#C7756B'
        },
        showSymbol: false,
        data: factor[item],
        xAxisIndex: index,
        yAxisIndex: index
      });
      title.push({
        top: index * 10 + 4 + '%',
        left: 'left',
        text: item.toLocaleUpperCase(),
        textStyle: {
            fontSize: 14
        }
      });
    });
    chart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        title,
        xAxis,
        yAxis,
        grid,
        series
    }, true);
}
export const loadFactorChange = async (containerId, changeUrl)=>{
    let chart = echarts.init(document.getElementById(containerId));
    const year = [2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017, 2019];
    const factor = ['FV', 'PV', 'BUS', 'PD', 'PGS', 'PCGDP', 'IS', 'PCRA', 'PRSI'];
    let data = await axios.get(changeUrl);
    data = data.data;
    chart.setOption({
        polar: {
            radius: ['8%', '85%'],
        },
        angleAxis: {
            type: 'category',
            data: year,
            boundaryGap: false,
            axisLabel:{
                interval:0
            },
            axisTick:{
                show: false
            },
            axisLine: {
                show: false
            },
            minorSplitLine:{
                show: true
              }
        },
        radiusAxis: {
            type: 'category',
            data: factor,
            z: 100,
            axisLabel: {
                interval: 0,
                fontSize: 10
            },
            axisLine: {
                lineStyle: {
                    color: '#555'
                }
            },
            splitLine: {
                show: true,
                interval: 0,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            }
        },
        series: [
            {
                type: 'custom',
                coordinateSystem: 'polar',
                renderItem: (params, api)=>{
                    let values = [api.value(0), api.value(1)];
                    let coord = api.coord(values);
                    let size = api.size([1, 1], values);
                    return {
                        type: 'sector',
                        shape: {
                            cx: params.coordSys.cx,
                            cy: params.coordSys.cy,
                            r0: coord[2] - size[0] / 2,
                            r: coord[2] + size[0] / 2,
                            startAngle: -(coord[3] + size[1] / 2),
                            endAngle: -(coord[3] - size[1] / 2)
                        },
                        style: api.style({
                            fill: data[params.dataIndex][2] > 0 ? '#F2B5D4' : data[params.dataIndex][2] < 0 ? '#7BDFF2' : '#ddd',
                            stroke: '#fff'
                        })
                    };
                },
                data: data
            }
        ]
    });
}