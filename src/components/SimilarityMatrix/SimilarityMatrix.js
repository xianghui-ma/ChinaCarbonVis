import {Chart} from '@antv/g2';
import axios from 'axios';

export const drawSimilarityHeatmap =async (containerId, dataUrl)=>{
    // let data = await axios.get(dataUrl);
    // data = data.data;
    const data = [[0, 0, 69], [1, 0, 83], [2, 0, 85], [3, 0, 84], [4, 0, 88], [5, 0, 91], [6, 0, 91], [7, 0, 89], [8, 0, 94], [0, 1, 79], [1, 1, 80], [2, 1, 84], [3, 1, 82], [4, 1, 89], [5, 1, 93], [6, 1, 92], [7, 1, 91], [0, 2, 81], [1, 2, 85], [2, 2, 90], [3, 2, 86], [4, 2, 89], [5, 2, 95], [6, 2, 96], [0, 3, 85], [1, 3, 88], [2, 3, 89], [3, 3, 88], [4, 3, 92], [5, 3, 97], [0, 4, 85], [1, 4, 88], [2, 4, 89], [3, 4, 88], [4, 4, 95], [0, 5, 90], [1, 5, 92], [2, 5, 95], [3, 5, 92], [0, 6, 95], [1, 6, 96], [2, 6, 95], [0, 7, 93], [1, 7, 96], [0, 8, 97]];
    const source = data.map((arr) => {
        return {
            name: arr[0],
            year: arr[1],
            sales: arr[2],
        };
    });
    const chart = new Chart({
        container: containerId,
        autoFit: true
    });

    chart.data(source);

    chart.scale('name', {
        type: 'cat',
        values: [2001,2003,2005,2007,2009,2011,2013,2015,2017]
    });
    chart.scale('year', {
        type: 'cat',
        values: [2019,2017,2015,2013,2011,2009,2007,2005,2003]
    });
    chart.scale('sales', {
        nice: true,
    });

    chart.axis('name', {
        tickLine: null,
        grid: {
            alignTick: false,
            line: {
                style: {
                    lineWidth: 0
                },
            },
        },
    });

    chart.axis('year', {
        title: null,
        grid: {
            alignTick: false,
            line: {
                style: {
                    lineWidth: 0
                }
            },
        },
    });

    chart
    .polygon()
    .position('name*year')
    .color('sales', '#BAE7FF-#1890FF-#0050B3')
    .style({
        lineWidth: 1,
        stroke: '#fff',
    });

    chart.interaction('element-active');
    chart.tooltip(false);
    chart.legend(false);
    chart.render();
}