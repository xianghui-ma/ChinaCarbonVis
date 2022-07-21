import L from 'leaflet';
import * as d3 from "d3";
import 'leaflet-arrowheads';

export const loadMap = ()=>{
    let map = L.map('traMap', {
        zoomControl:false
    }).setView([38.56, 110.20], 4);
    L.tileLayer('https://api.mapbox.com/styles/v1/smallma/cl06fupgu00kw15oa4pq4y9i3/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbGxtYSIsImEiOiJja3lxeTRwdGUwaHpnMnV0Z2puN3hqY2Y4In0.JPUf6RG-a2zrvBVsyKLAFA').addTo(map);
    return map;
}
export const drawTrajectoryDomContainer = (map)=>{
    let nodeContainer = L.divIcon({
        html: "<div id='test' class='nodeContainer'></div>"
    });
    L.marker([38.56, 110.20], {
        icon: nodeContainer
    }).addTo(map);
}
// addNodeGraph(35, 25, 15, 'orange', svg, 35, 35, {baseLineValue: [5, 25, 50], rate: [0.3, 0.2, 0.1, 0.4]}, d3.scaleOrdinal(d3.schemeCategory20));
export const addNodeGraph = (maxRadius, outterCircleRadius, innerCircleRadius, innerCircleColor, container, cx, cy, cityRate, arcColor)=>{
    // 最外层包裹
    let outterG = container.append('g');

    // 绘制外圆
    outterG.append('g')
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', outterCircleRadius)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '3px');

    // 绘制内圆
    outterG.append('g')
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', innerCircleRadius)
        .attr('fill', innerCircleColor);

    // 创建圆弧路径
    let arcPath = d3.arc()
                .innerRadius(outterCircleRadius)
                .outerRadius(maxRadius);
    
    // 绘制圆弧
    let initAngle = -160;
    let arcRange = [];
    let endAngle = 0;
    let textAngle = [];
    cityRate.rate.forEach((rate)=>{
        endAngle = initAngle + rate * 320;
        textAngle.push(endAngle);
        arcRange.push({
            startAngle: initAngle * (Math.PI / 180),
            endAngle: endAngle * (Math.PI / 180)
        });
        initAngle = endAngle;
    });

    outterG.append('g').selectAll('path')
        .data(arcRange)
        .enter()
        .append('path')
        .attr('d', d => arcPath(d))
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('transform', `translate(${cx}, ${cy})`)
        .attr('fill', (d, i)=>{return arcColor(i);});
    
    // 标注中位数等数值
    outterG.append('g').selectAll('number')
        .data(cityRate.baseLineValue)
        .enter()
        .append('text')
        .text(d=>d)
        .attr('x', cx - 35)
        .attr('y', cy)
        .attr("transform", (d, i)=>{
            return `rotate(${textAngle[i] + 90}, ${cx} ${cy})`
        })
        .attr('font-size', '10px')
        .attr('font-weight', '800')
        .attr('writing-mode', 'sideways-lr')
        .attr('color', '#000');
};
// points为节点坐标数组，从起点到终点按顺序，如[[34.047112447489766, -118.92691612243652],......]
export const drawdrawTrajectoryLine = (points, map)=>{
    let polyline = L.polyline(points, { color: 'orange'}).arrowheads({
        yawn: 40,
        fill: true,
        // frequency: '1000m'
    }).addTo(map);
    map.fitBounds(polyline.getBounds());
}