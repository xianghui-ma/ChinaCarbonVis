import * as echarts from 'echarts';
import axios from 'axios';
import * as d3 from "d3";

export const drawMesBar = async (containerId, dataUrl)=>{
    let res = await axios.get(dataUrl);
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    res = res.data;
    res.series.forEach((item)=>{
        item.showBackground = true;
        item.label.show = true;
        item.itemStyle = {
            color: (par)=>{
              return color(par.dataIndex);
            }
        }
    });
    res.xaxisData.forEach((item, index)=>{
        item.textStyle.borderColor = color(index);
    });
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: '25%'
        },
        xAxis:[
          {
            type: 'category',
            offset: -10,
            axisLabel: {
              interval:0
            },
            axisLine: {show: false},
            axisTick: { show: false },
            data: res.xaxisData
          }
        ],
        yAxis: {
          show: false
        },
        series: res.series
      });
}