let svgColor = 'white';

/**
 * Draw a pie chart for the number of parent school satisfaction.
 * @param data @type array 
 * @return void 
 */
function pieChart(data){
  var width = d3.select('.pie1').node().offsetWidth ;
  var height = 400;
  var color = d3.scaleOrdinal(['#630458', '#bd6bb4'])
  //separate the objects of good satisfactions and bad satisfaction
  let Good = data.filter(student =>student['ParentschoolSatisfaction'] === 'Good')
  let Bad = data.filter(student =>student['ParentschoolSatisfaction'] === 'Bad')
  //set the array of filtred data to work on
  let ParentSatisfactionData = [{label: 'Good', count: Good.length}, {label: 'Bad', count: Bad.length}]

  var svg = d3.select('.pie1').append('svg').classed('border rounded', true)
          .attr('width', width).attr('height', height)
          .style('background-color', svgColor);

  let pieData = d3.pie().value(function(d){return d.count;})(ParentSatisfactionData);    
  let segments = d3.arc().innerRadius(0).outerRadius(130)

  let sections = svg.append('g').attr('transform', 'translate(250, 180)').selectAll('path').data(pieData);
  sections.enter().append('path').transition().duration(2000)
  .attrTween("d", function(d){
    var i = d3.interpolate({startAngle: 0*Math.PI, endAngle: 0*Math.PI}, d);
    return function(t) { return segments(i(t)); };
  }).attr('fill', function(d){
      return color(d.data.count)
  });
  
  //Display the count of each segment
  d3.select('g').selectAll('text').data(pieData).enter()
    .append('text').classed('count', true).each(function(d){
          var center = segments.centroid(d);
          d3.select(this).attr('x', center[0]).attr('y', center[1]).text(d.data.count)
    })
  
  //Display the legends on the chart
  let legends = svg.append('g').attr('transform', 'translate(480, 130)')
                    .selectAll('.legends').data(pieData);
  let legend = legends.enter().append('g').classed('legends', true).attr('transform', function(d, i){
      return 'translate(0, ' + (i+1)*30+')';
  });
  legend.append('rect').attr('width', 20).attr('height', 20)
        .attr('fill', function(d){
            return color(d.data.count);
        });
        legend.append('text').text((d)=>{
            return d.data.label;
        }).attr('fill', function(d){
          return color(d.data.count);
      }).attr('x', 28).attr('y', 17);
  svg.append('g').attr('transform', 'translate(150, 380)').append('text').text('Number of parent school satisfaction (good & bad).').classed('chart-title', true)
      
}

/**
 * Draw a donut chart for the number of students visits of a course content by educational stage.
 * @param data @type array 
 * @return void 
 */
function donutChart(data){
  var width = d3.select('.pie2').node().offsetWidth;
  var height = 400;
  var colors = d3.scaleOrdinal(['#630458', '#bd6bb4','#aa3588'])
  //filter the data to get the number of course visites by educational stage
  var VisitedResourcesData = data.reduce((d, c) => {
    if(!d.length) d = [];
    var StageID = c.StageID;
    if (!d.some(student => student.label === StageID)) {
      d.push({label: StageID, count: 0});
    }
    let i = d.findIndex(std=> std.label === StageID)
    d[i].count += parseInt(c.VisITedResources);
    return d;
  }, {});

  var svg = d3.select('.pie2').append('svg').classed('border rounded', true)
          .attr('width', width).attr('height', height)
          .style('background-color', svgColor);

  let donutData = d3.pie().value(function(d){return d.count;})(VisitedResourcesData);    
  let segments = d3.arc().innerRadius(0).outerRadius(130).innerRadius(60);

  let sections = svg.append('g').attr('transform', 'translate(250, 180)').selectAll('path').data(donutData);
  sections.enter().append('path').transition().duration(2000)
  .attrTween("d", function(d){
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, d);
    return function(t) { return segments(i(t)); };
  }).attr('fill', function(d){
      return colors(d.data.count)
  });
      
  d3.select('.pie2').select('g').selectAll('text').data(donutData)
  .enter().append('text').classed('count', true).each(function(d){
        var center = segments.centroid(d);
        d3.select(this).attr('x', center[0]-22).attr('y', center[1]).text(d.data.count)
  })
  
  //add the legends to the chart
  let legends = svg.append('g').attr('transform', 'translate(480, 130)')
                    .selectAll('.legends2').data(donutData);
  let legend = legends.enter().append('g').classed('legends2', true).attr('transform', function(d, i){
      return 'translate(0, ' + (i+1)*30+')';
  });
  legend.append('rect').attr('width', 20).attr('height', 20)
        .attr('fill', function(d){
            return colors(d.data.count);
        });
        legend.append('text').text((d)=>{
            return d.data.label;
        }).attr('fill', function(d){
          return colors(d.data.count);
      }).attr('x', 28).attr('y', 17);

  svg.append('g').attr('transform', 'translate(100, 380)').append('text').text('Number of times the student visits a course content by educational stage.').classed('chart-title', true)
      
}

/**
 * Draw a stacked bar chart for the number of absences by educational stage.
 * @param data @type array 
 * @return void 
 */
function stackedBarChart(data){
  
  var colors = d3.scaleOrdinal(['#28071b', '#8e0d5b'])
  var margin = {top: 30, right: 10, bottom: 130, left: 60};
  //filter the data to get the number of (under 7 days & above 7 days) absence by educational stage.
  var barDataSet = data.reduce((d, c) => {
    if(!d.length) d = [];
    var StageID = c.StageID;
    if (!d.some(student => student.stage === StageID)) {
      d.push({stage: StageID, under7: 0, above7: 0});
    }
    let i = d.findIndex(std=> std.stage === StageID)
    if(c.StudentAbsenceDays === 'Under-7'){
      d[i].under7++;
        return d;
    }
    d[i].above7++;
    return d;
  }, {});
  
  var width = d3.select('.bar1').node().offsetWidth - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select(".bar1").append("svg").classed('border rounded', true)
  .attr("width", width + margin.left + margin.right).attr("height", 400)
  .style('background-color', svgColor)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  //get the stacked data
  var stackedDataset = d3.stack().keys(['above7', 'under7'])(barDataSet);
  
  //x axis
  let xScale = d3.scaleBand().domain(d3.map(barDataSet, function(d){return(d.stage.toUpperCase())}).keys())
                  .range([0, width]).padding(0.5);
  svg.append("g").attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSizeOuter(0));
  
  //y axis
  let yScale = d3.scaleLinear().domain([0, 250]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(yScale));

  svg.append('g').selectAll('g').data(stackedDataset).enter()
  .append("g").attr("fill", function(d) { return colors(d.key); })
  .selectAll("rect").data(function(d) { return d; })
  .enter().append("rect")
  .attr("x", function(d) { return xScale(d.data.stage.toUpperCase()); })
  .attr("y", function(d) { return yScale(0); })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) { return yScale(d[0]) - yScale(0); })
  
  // add animation
  svg.selectAll("rect")
  .transition()
  .duration(2000)
  .attr("y", function(d) { return yScale(d[1]); })
  .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })

  let legends = svg.append('g').attr('transform', 'translate(80, 130)')
  .selectAll('.legends').data(stackedDataset);
  let legend = legends.enter().append('g').classed('legends', true).attr('transform', function(d, i){
     return 'translate(' + (i+1)*120+', 150)';
  });
  let legendText = {above7: 'Above 7', under7: 'Under 7'}
  legend.append('rect').attr('width', 20).attr('height', 20)
  .attr('fill', function(d){
    return colors(d.key);
  });
  legend.append('text').text((d)=>{
    return legendText[d.key];
  }).attr('fill', function(d){
    return colors(d.key);
  }).attr('x', 28).attr('y', 17);

  
  svg.append('g').attr('transform', 'translate(50, 350)').append('text').text('Number of absences (under 7 days and above 7 days) by educational stage.').classed('chart-title', true)
}

/**
 * Draw a horizontal lollipop chart for the number of students by nationality.
 * @param data @type array 
 * @return void 
 */
function hozLollipopChart(data){
  var margin = {top: 30, right: 20, bottom: 130, left: 90};
  //filter the data to get the number of student by nationality
  var barDataSet = data.reduce((d, c) => {
    if(!d.length) d = [];
    var NationalITy = c.NationalITy;
    if (!d.some(student => student.nationality === NationalITy)) {
      d.push({nationality: NationalITy, count: 0});
    }
    let i = d.findIndex(student=> student.nationality === NationalITy)
    d[i].count++;
    return d;
  }, {});

  var width = d3.select('.bar2').node().offsetWidth - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select(".bar2").append("svg").classed('border rounded', true)
  .attr("width", width + margin.left + margin.right).attr("height", 400)
  .style('background-color', svgColor)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //sort the data
  barDataSet.sort(function(b, a) {
    return a.count - b.count;
  })

  // x axis
  let xScale = d3.scaleLinear()
              .domain([0, 180])
              .range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xScale))
     .selectAll('text').attr("transform", "translate(5, 0)")
     .style("text-anchor", "end");
  
  // y axis
  let yScale = d3.scaleBand().range([0, height])
              .domain(barDataSet.map(function(d) { return d.nationality.toUpperCase(); }))
              .padding(1);
  svg.append("g").call(d3.axisLeft(yScale));

  svg.selectAll("myline")
  .data(barDataSet).enter().append("line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1", function(d) { return yScale(d.nationality.toUpperCase()); })
    .attr("y2", function(d) { return yScale(d.nationality.toUpperCase()); })
    .attr("stroke", "grey")

  svg.selectAll("mycircle")
    .data(barDataSet).enter().append("circle")
      .attr("cx", xScale(0))
      .attr("cy", function(d) { return yScale(d.nationality.toUpperCase()); })
      .attr("r", "7")
      .style("fill", "#bd6bb4")
      .attr("stroke", "black")

  //add animation
  svg.selectAll("circle").transition()
    .duration(2000)
    .attr("cx", function(d) { return xScale(d.count); })
  svg.selectAll("line")
    .transition()
    .duration(2000)
    .attr("x1", function(d) { return xScale(d.count); })

  svg.append('g').attr('transform', 'translate(180, 350)').append('text').text('Number of students by nationality.').classed('chart-title', true)


}

/**
 * Draw a bar chart for the number of raised hands per topic.
 * @param data @type array
 * @return void 
 */
function barChart(data){
  //filter the data to get the number of raised hands per topic
  var barData = data.reduce((d, c) => {
    if(!d.length) d = [];
    var Topic = c.Topic;
    if (!d.some(student => student.topic === Topic)) {
        d.push({topic: Topic, count: 0});
    }
    let i = d.findIndex(std=> std.topic === Topic)
    d[i].count += parseInt(c.raisedhands);
    return d;
  }, {});

  var margin = {top: 30, right: 10, bottom: 130, left: 60};
  var width = d3.select('.bar3').node().offsetWidth - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var svg = d3.select(".bar3").append("svg").classed('border rounded', true)
  .attr("width", width + margin.left + margin.right).attr("height", 400)
  .style('background-color', svgColor)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //x axis
  let xScale = d3.scaleBand().domain(barData.map((d)=>{return d.topic.toUpperCase()}))
                  .range([0, width]).padding(0.5);
  svg.append("g").attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale)).selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");
  
  //y axis
  let yScale = d3.scaleLinear().domain([0, 3000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(yScale));

  svg.selectAll("mybar").data(barData).enter()
  .append("rect").attr("x", function(d) { return xScale(d.topic.toUpperCase()); })
  .attr("y", function(d) { return yScale(0); })
  .attr("width", xScale.bandwidth())
  .attr("height", function(d) { return height - yScale(0); })
  .attr("fill", "#bd6bb4");

  //add animation
  svg.selectAll("rect")
  .transition()
  .duration(8000)
  .attr("y", function(d) { return yScale(d.count); })
  .attr("height", function(d) { return height - yScale(d.count); })

  svg.append('g').attr('transform', 'translate(550, 350)').append('text').text('Number of raised hands per topic.').classed('chart-title', true)

}

//call the csv file and pass the data to the draw functions
d3.csv('xAPI-Edu-Data.csv').then(function(data) {
  pieChart(data);
  donutChart(data)
  stackedBarChart(data);
  hozLollipopChart(data);
  barChart(data);  
});

  
