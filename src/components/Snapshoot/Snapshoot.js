import * as d3 from "d3";
import axios from 'axios';
import PubSub from 'pubsub-js';

let preEle = null;

const drawSnapshoot = (map, factorData, cityNum, similiarty, pointLocations, container, clientWidth, clientHeight)=>{
    const centerX = clientWidth / 2;
    const centerY = clientHeight / 2;
    const r = (Math.min(clientWidth, clientHeight) - 100) / 2;
    const factorCircleDeg = [18 * 4, 18 * 3, 18 * 2, 18 * 1, 0, -18 * 1, -18 * 2, -18 * 3, -18 * 4];
    const factorCircleR = r * 0.08;
    const arcInnerR = r * 0.9;
    const arcOuterR = r * 1.5;
    const linear = d3.scaleLinear()
        .domain([0, 169])
        .range([0, 144]);
    const similiartyLinear = d3.scaleLinear()
        .domain([0, 53])
        .range([r, arcOuterR]);
    const factorLinear = d3.scaleLinear()
        .domain([0, 1])
        .range([factorCircleR * 0.5, factorCircleR]);

    let startEdg = 18;
    let outerArcStartEdg = 0;
    const arcColor = ['#C54E83', '#4EBABC', '#F4A2B9', '#8FC1D9', '#FFC599'];
    const pointColor = {'HH': '#C54E83', 'LL': '#4EBABC', 'HL': '#F4A2B9', 'LH': '#8FC1D9', 'NS': '#FFC599'};
    const factorColor = {'positive': '#F2B5D4', 'negative': '#7BDFF2', 'no': '#ddd'}

    // 创建弧生成器
    const innerArcPath = d3.arc()
        .innerRadius(arcInnerR)
        .outerRadius(r);
    
    let GraContainer = container.append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    // 绘制小圆
    GraContainer.append('g')
        .selectAll('factorCircle')
        .data(factorCircleDeg)
        .enter()
        .append('g')
        .append('circle')
        .attr('cx', centerX - r + factorCircleR)
        .attr('cy', centerY)
        .attr('r', (_, i)=>{
            return factorLinear(Math.abs(factorData[i].flag));
        })
        .attr("transform", (d)=>{
            return `rotate(${d}, ${centerX}, ${centerY})`
        })
        .style('fill', (_, i)=>{
            let flag = factorData[i].flag;
            return flag > 0 ? factorColor.positive : flag < 0 ? factorColor.negative : factorColor.no;
        });

    // 绘制圆弧
    GraContainer.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('arc')
        .data(cityNum)
        .enter()
        .append('g')
        .append('path')
        .attr('d', (d, i)=>{
            let res = innerArcPath({
                startAngle: startEdg * (Math.PI / 180),
                endAngle: (startEdg + linear(d)) * (Math.PI / 180)
            });
            if(i !== 4){
                startEdg += linear(d);
            }else{
                startEdg = 18;
            }
            return res;
        })
        .style('fill', (d, i)=>{
            return arcColor[i];
        });

    // 绘制地图
    let projection = d3.geoMercator()
                .center([107, 31])
                .scale(r * 1.4)
                .translate([centerX * 1.05, centerY * 1.1]);
    let path = d3.geoPath()
                .projection(projection);
    let mapContainer = GraContainer.append('g');
    mapContainer.selectAll('path')
        .data(map.features)
        .enter()
        .append('path')
        .style('fill', '#eee')
        .attr('d', path);
    
    // 绘制地图上的点
    let locSvg = mapContainer.selectAll('location')
        .data(pointLocations)
        .enter()
        .append('g')
        .attr('transform', (d)=>{
            let coor = projection([d.lon, d.lat]);
            return `translate(${coor[0]}, ${coor[1]})`;
        });
    locSvg.append('circle')
        .attr('r', 2)
        .attr('fill', (d, i)=>{
            return pointColor[d.class];
        });

    // 绘制外圆弧
    GraContainer.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .selectAll('arc')
        .data(similiarty)
        .enter()
        .append('g')
        .append('path')
        .attr('d', (d, _)=>{
            const outerArcPath = d3.arc()
                .innerRadius(r)
                .outerRadius(similiartyLinear(d));
            let res = outerArcPath({
                startAngle: outerArcStartEdg * (Math.PI / 180),
                endAngle: (outerArcStartEdg + 36) * (Math.PI / 180)
            });
            outerArcStartEdg += 36;
            return res;
        })
        .style('fill', '#A8E0B7')
        .style('stroke', '#fff');

}
const chooseYear = (e)=>{
    if(preEle){
        preEle.checked = false;
    }
    preEle = e.target;
    PubSub.publish('chooseYear', e.target.value);
}
export const loadSnapshootBox = async (mapUrl, dataUrl, simUrl)=>{
    let mapData = await axios.get(mapUrl);
    let data = await axios.get(dataUrl);
    let similiarty = await axios.get(simUrl);
    mapData = mapData.data;
    data = data.data;
    similiarty = similiarty.data;
    const container = d3.select('.snapshoot');
    for(let year = 2001; year <= 2019; year +=2){
        let containerItem = container.append('section');
        containerItem.attr('class', 'snapshootItem')
            .append('header')
            .attr('class', 'yearMark')
            .text(year);
        let input = containerItem.append('input')
            .attr('type', 'checkbox')
            .attr('value', year)
            ._groups[0][0];
        input.addEventListener('click', chooseYear);
        if(year === 2001){
            input.checked = true;
            preEle = input;
        }
        let {clientWidth ,clientHeight} = containerItem._groups[0][0];
        drawSnapshoot(mapData, data[year]['factors'], data[year]['classNum'], similiarty[year], data[year]['pos'], containerItem, clientWidth, clientHeight);
    }
}