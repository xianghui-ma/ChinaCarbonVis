import * as d3 from "d3";
import axios from 'axios';

export const initCanvas = (containerId)=>{
    return d3.select(`#${containerId}`)
            .append("svg")
            .attr('width', '100%')
            .attr('height', '100%');
}
const drawSingleCircle = (rotateDeg, mapData, mapScale, mapTranslateArr, mapCenterArr, outterCircleRadius, innerCircleScale, factorCircleRadius, arcData, factorCircleData, canvas, cx, cy, colorCollection, pointLocations)=>{
    let fillColor = {
        'HH': '#CC3399',
        'LL': '#66CC99',
        'HL': '#FFCC99',
        'LH': '#CC9966',
        'NS': '#999999'
    };
    let fillColorArr = ['#CC3399', '#66CC99', '#FFCC99', '#CC9966', '#999999'];
    // 构建圆弧角度范围
    let preEndAlgle = 0;
    let arcRange = [];
    let rate = 0;
    for(let i = 0; i < arcData.length; i++){ 
        rate = 180 * (arcData[i] / 196);
        arcRange[i] = {
            startAngle: preEndAlgle * (Math.PI / 180),
            endAngle: (preEndAlgle + rate) * (Math.PI / 180)
        }
        preEndAlgle = preEndAlgle + rate;
    }

    // 创建圆弧路径
    let arcPath = d3.arc()
                .innerRadius(outterCircleRadius - innerCircleScale)
                .outerRadius(outterCircleRadius);

    // 最外层包裹
    let outterG = canvas.append('g')
                        .attr('transform', `rotate(${rotateDeg}, ${cx} ${cy}) translate(${cx - 210}, ${cy})`);

    // 绘制圆弧
    outterG.append('g')
        .attr('transform', `rotate(${-1 * rotateDeg})`)
        .selectAll('path')
        .data(arcRange)
        .enter()
        .append('path')
        .attr('d', d => arcPath(d))
        .attr('fill', (d, i)=>{return fillColorArr[i];});

    // 绘制外圆
    outterG.append('circle')
        .attr('r', outterCircleRadius)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '3px');

    // 绘制九个影响因素
    let rotateAngle = [0, 18, 18*2, 18*3, 18*4, -18, -18*2, -18*3, -18*4];
    outterG.append('g')
            .attr('transform', `rotate(${-1 * rotateDeg})`)
            .selectAll('factor')
            .data(rotateAngle)
            .enter()
            .append('circle')
            .attr('cx', -1 * (outterCircleRadius - factorCircleRadius - 2))
            .attr('r', factorCircleRadius)
            .attr("transform", (d)=>{
                return `rotate(${d})`
            })
            .attr('fill', (d, i)=>{
                if(factorCircleData[i].flag){
                    return factorCircleData[i].flag < 0 ? '#8A2BE2' : '#CC0033';
                    // return '#f05654';
                }else{
                    return '#ccc';
                }
            });

    // 绘制点
    let projection = d3.geoMercator()
                .center(mapCenterArr)
                .scale(mapScale)
                .translate(mapTranslateArr);
    let path = d3.geoPath()
                .projection(projection);
    let groups = outterG.append('g')
                        .attr('transform', `rotate(${-1 * rotateDeg}) translate(${-200}, ${-150})`);
    groups.selectAll('path')
            .data(mapData.features)
            .enter()
            .append('path')
            .style('fill', '#ccc')
            .attr('stroke', '#ccc')
            .attr('stroke-width', '1px')
            .attr('d', path);
    let locSvg = groups.selectAll('.location')
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
                return fillColor[d.class];
            });

}
export const drawAllCircle = async (containerId, svg, startYear, endYear, mapUrl, dataUrl)=>{
    let mapJson = await axios.get(mapUrl);
    let dataRes = await axios.get(dataUrl);
    mapJson = mapJson.data;
    dataRes = dataRes.data;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let ele = document.getElementById(containerId);
    let centerY = ele.offsetHeight / 2;
    let centerX = ele.offsetWidth / 2;
    let index = -1;
    for(let i = startYear; i <= endYear; i += 2){
        index++;
        drawSingleCircle(index * 36, mapJson, 85, [203, 163], [107, 31], 60, 10, 5, dataRes[i].classNum, dataRes[i].factors, svg, centerX, centerY, color, dataRes[i].pos)
    }                                                                               //[HH, LL, HL, LH, NS]数量
}
const fade = (opacity, edgeContainer)=>{
    return (g, i)=>{
        edgeContainer.selectAll('.edge')
                        .filter((d)=>{
                            return d.source.index != i && d.target.index != i;
                        })
                        .transition()
                        .style('opacity', opacity);
    };
}
export const drawChord = (svg)=>{
    let nodes = ['2007', '2009', '2011', '2013', '2015', '2017', '2019', '2001', '2003', '2005'];
    let minColor=d3.rgb(255,255,255)
    let maxColor=d3.rgb(255,153,0)
    let colorCompute = d3.interpolate(minColor, maxColor) // 返回一个函数
    

    let chords = [
        [1, 94, 89, 91, 91, 88, 84, 85, 83, 69],
        [94, 1, 91, 92, 93, 89, 82, 84, 80, 79],
        [89, 91, 1, 96, 95, 89, 86, 90, 85, 81],
        [91, 92, 96, 1, 97, 92, 88, 89, 88, 85],
        [91, 93, 95, 97, 1, 95, 88, 89, 88, 85],
        [88, 89, 89, 92, 95, 1, 92, 95, 92, 90],
        [84, 82, 86, 88, 88, 92, 1, 95, 96, 95],
        [85, 84, 90, 89, 89, 95, 95, 1, 96, 93],
        [83, 80, 85, 88, 88, 92, 96, 96, 1, 97],
        [69, 79, 81, 85, 85, 90, 95, 93, 97, 1],
    ];
    let chordLayout = d3.chord().padAngle(0.1)(chords);
    let chordContainer = svg.append('g')
        .attr('transform', 'translate(274, 281)');
    let nodeContainer = chordContainer.append('g');
    let edgeContainer = chordContainer.append('g');
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc()
                    .innerRadius(150)
                    .outerRadius(135);
    nodeContainer.selectAll('g')
                    .data(chordLayout.groups)
                    .enter()
                    .append('g')
                    // .attr('class', 'node')
                    .append('path')
                    .attr('class', 'node')
                    .attr('d', d=>arc(d))
                    .attr('fill', '#fff')
                    .attr('stroke', '#aaa');
    
    

    let ribbon = d3.ribbon()
                    .radius(135);
    edgeContainer.selectAll('path')
                .data(chordLayout)
                .enter()
                .append('path')
                .attr('class', 'edge')
                .attr('d', ribbon)
                .attr('fill', (d)=>{                    
                    if(d.source.index === d.source.subindex && d.target.index === d.target.subindex){
                        return 'none';
                    }else{
                        return colorCompute(d.source.value * (9 / 280) - 2.102);
                    }
                });

    nodeContainer.selectAll('.text')
                .data(chordLayout.groups)
                .enter()
                .append('text')
                .each((d, i)=>{
                    d.angle = (d.startAngle + d.endAngle) / 2;
                    d.name = nodes[i];
                })
                .attr('transform', (d)=>{
                    let result = `rotate(${d.angle * 180 / Math.PI})`;
                    result += `translate(-20, ${-1.0 * (135)})`;
                    return result;
                })
                .text(d=>d.name)
                .style('fill', '#aaa')
                .style('font-size', '16px');
    
    nodeContainer.selectAll('.node')
                    .on('mouseover', fade(0.0, edgeContainer))
                    .on('mouseout', fade(1.0, edgeContainer));
    
}