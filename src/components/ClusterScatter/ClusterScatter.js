import axios from "axios";
import * as echarts from 'echarts';

export const drawClusterScatter = async (containerId, dataUrl)=>{
    let res = await axios.get(dataUrl);
    res = res.data;
    let label = res.label;
    let colorCol = ['#37A2DA','#e06343','#37a354','#b55dba','#b5bd48','#8378EA','#96BFFF', 'orange'];
    let chart = echarts.init(document.getElementById(containerId));
    chart.setOption({
        xAxis: {
            show: false
        },
        yAxis: {
            show: false
        },
        grid:{
            left: '3%',
            right: 0,
            bottom: 0,
            top: '3%'
        },
        toolbox: {
            right: '5%',
            bottom: 0,
            feature: {
                brush: {
                    type: ['polygon',  'rect',  'clear']
                }
            }
        },
        brush: {},
        series: [
            {
                symbolSize: 10,
                data: res.cor,
                type: 'scatter',
                itemStyle:{
                    color: (par)=>{
                        return colorCol[label[par.dataIndex]];
                    }
                }
            }
        ]
    }, true);
}