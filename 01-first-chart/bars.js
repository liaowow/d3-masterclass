import * as d3 from "d3";

async function drawBars() {
  // 1. access data
  const data = await d3.json("./data/nyc_weather_data.json")

  const drawHistogram = metric => {

    const xAccessor = d => d[metric]
    const yAccessor = d => d.length
  
    // 2. create chart dimensions
    const width = 600
    let dimensions = {
      width,
      height: width * 0.6,
      margin: {
        top: 30,
        right: 10,
        bottom: 50,
        left: 50
      }
    }
    dimensions.boundedWidth = dimensions.width
      - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
      - dimensions.margin.top - dimensions.margin.bottom
    
    // 3. draw canvas
    const wrapper = d3.select('#wrapper')
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
  
    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
  
    // 4. create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()
      
      const binGenerator = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(12)
      
      const bins = binGenerator(data)
      
      const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()
    
    // 5. draw data
    const binsGroup = bounds.append("g")
    const binGroups = binsGroup.selectAll("g")
      .data(bins)
      .join("g")
  
    const barPadding = 1
    const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0, 
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(yAccessor(d))
      )
      .attr("fill", "cornflowerblue")
  
    // 6. add labels
    const barText = binGroups.filter(yAccessor)
      .append("text")
      .attr("x", d => xScale(d.x0) + (
        (xScale(d.x1) - xScale(d.x0)) / 2
      ))
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .style("fill", "#666")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
    
    // 7. draw peripherals
    const mean = d3.mean(data, xAccessor)
    const meanLine = bounds.append("line")
        .attr("x1", xScale(mean))
        .attr("x2", xScale(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke", "maroon")
        .style("stroke-dasharray", "4px 4px")
    const meanLabel = bounds.append("text")
        .attr("x", xScale(mean))
        .attr("y", -20)
        .text("mean")
        .style("text-anchor", "middle")
        .attr("fill", "maroon")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
    
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .text(metric.replace(/([A-Z])/g, ' $1'))
        .style("text-transform", "capitalize")
        .attr("fill", "black")
        .style("font-size", "1.4em")
  }

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
    "visibility"
  ]
  metrics.forEach(drawHistogram)
}

drawBars()