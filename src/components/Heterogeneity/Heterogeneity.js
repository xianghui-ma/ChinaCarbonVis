import * as echarts from 'echarts';
import axios from 'axios';
import * as d3 from "d3";
import PubSub from 'pubsub-js';

const cluColor = ['#16D6FA', '#979BD9', '#A8F387', '#3ABA8F', '#AF64E8', '#D62424'];

const drawHeterCluster = (container, num, yName, series)=>{
    let chart = echarts.init(container);
    chart.setOption({
        grid: {
            left: '6%',
            right: 0,
            bottom: '10%',
            top: '10%'
        },
        title: {
            text: '簇' + (num + 1),
            right: '7%',
            textStyle: {
                fontSize: 15,
                color: cluColor[num]
            }
        },
        xAxis: {
            type: 'category',
            data: yName,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value'
        },
        series
    });
}
const addCheckBox = (itemArr, type)=>{
    itemArr.forEach((item, index)=>{
        let input = item.append('form')
            .attr('class', 'chooseBox')
            .append('input')
            .attr('type', 'checkbox')
            .attr('value', index);
        input._groups[0][0].addEventListener('click', (e)=>{
            if(e.target.checked){
                PubSub.publish('addClu', {adcode: type[e.target.value], fillColor: cluColor[e.target.value], cluNum: e.target.value});
            }else{
                PubSub.publish('delClu', {cluNum: e.target.value});
            }
        });
    });
}
export const loadHeterogeneity = async (lisaUrl, factorUrl, heterCluUrl)=>{
    const lisaColor = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    const itemArr = [];
    let lisa = await axios.get(lisaUrl);
    let factor = await axios.get(factorUrl);
    let heter = await axios.get(heterCluUrl);
    lisa = lisa.data;
    factor = factor.data;
    heter = heter.data.label;
    let type = [];
    for(let adcode in heter){
        if(!type[heter[adcode]]){
            type[heter[adcode]] = [adcode];
        }else{
            type[heter[adcode]].push(adcode);
        }
    }
    let container = d3.select('.heterogeneity');
    container._groups[0][0].innerHTML = '';
    type.forEach((item, index)=>{
        let itemContainer = container.append('section').attr('class', 'heterItem');
        itemArr.push(itemContainer);
        itemContainer = itemContainer._groups[0][0];
        let series = [];
        let yName = Object.keys(factor['110000']);
        yName.pop();
        item.forEach((adcode)=>{
            series.push({
                data: yName.map((item)=>{
                    return factor[adcode][item];
                }),
                type: 'line',
                symbol: 'none',
                smooth: true,
                lineStyle: {
                    color: lisaColor[lisa[adcode].lisa]
                }
            });
        });
        drawHeterCluster(itemContainer, index, yName.map((item)=>{
            return item.replace('cof_', '').toUpperCase();
        }), series);
    });
    addCheckBox(itemArr, type);
}