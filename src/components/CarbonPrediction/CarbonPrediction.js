import axios from 'axios';
import * as echarts from 'echarts';

export const drawPredictionChart = async (containerId, dataUrl, adcode)=>{
    let prediction = await axios.get(dataUrl);
    prediction = prediction.data;
    let chart = echarts.init(document.getElementById(containerId));
    let xLabel = [];
    for(let year = 2001; year <= 2024; year++){
        xLabel.push(year);
    }
    chart.setOption({
        grid: {
            left: '5%',
            top: '5%',
            right: '2%',
            bottom: '6%'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xLabel
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: prediction[adcode],
                type: 'line',
                smooth: true,
                symbol: 'none',
                markArea: {
                    itemStyle: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    data: [
                        [
                            {
                                xAxis: '2020'
                            },
                            {
                                xAxis: '2024'
                            }
                        ]
                    ]
                }
            }
        ]
    }, true);
}