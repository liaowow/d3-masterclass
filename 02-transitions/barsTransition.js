import * as d3 from "d3";

async function drawBars() {
  // 1. access data
  const data = await d3.json("./data/nyc_weather_data.json")

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
  
  // init static elements and add CSS classes
  bounds.append("g")
      .attr("class", "bins")
  bounds.append("line")
      .attr("class", "mean")
  bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .append("text")
      .attr("class", "x-axis-label")

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length
  
    // 4. create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()
      
      const binGenerator = d3.bin()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)
      
      const bins = binGenerator(data)
      
      const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()
    
    // 5. draw data
    const barPadding = 1

    let binGroups = bounds.select(".bins")
      .selectAll(".bin")
      .data(bins)     

    binGroups.exit().remove()

    const newBinGroups = binGroups.enter().append("g")
      .attr("class", "bin")
    
    newBinGroups.append("rect")
    newBinGroups.append("text")
  
    // update binGroups to include new points
    binGroups = newBinGroups.merge(binGroups)

    const barRects = binGroups.select("rect")
      .attr("x", d => xScale(d.x0) + barPadding)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([
        0, 
        xScale(d.x1) - xScale(d.x0) - barPadding
      ]))
      .attr("height", d => dimensions.boundedHeight
        - yScale(yAccessor(d))
      )
  
    // 6. add labels
    const barText = binGroups.select("text")
      .attr("x", d => xScale(d.x0) + (
        (xScale(d.x1) - xScale(d.x0)) / 2
      ))
      .text(yAccessor)
      .style("transform", d => `translateY(${
        yScale(yAccessor(d)) - 5
      }px)`)
    
    // 7. draw peripherals
    const mean = d3.mean(data, metricAccessor)
    const meanLine = bounds.selectAll(".mean")
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .style("transform", `translateX(${
          xScale(mean)
        }px)`)
    // const meanLabel = bounds.append("text")
    //     .attr("x", xScale(mean))
    //     .attr("y", -20)
    //     .text("mean")
    //     .style("text-anchor", "middle")
    //     .attr("fill", "maroon")
    //     .style("font-size", "12px")
    //     .style("font-family", "sans-serif")
    
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
    const xAxis = bounds.select(".x-axis")
        .call(xAxisGenerator)

    const xAxisLabel = xAxis.select(".x-axis-label")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .text(metric.replace(/([A-Z])/g, ' $1'))

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
  let selectedMetricIndex = 0
  drawHistogram(metrics[selectedMetricIndex])
  
  const button = d3.select("body")
    .append("button")
      .text("Change metric")

  button.node().addEventListener("click", handleBtnClick)
  function handleBtnClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % metrics.length
    drawHistogram(metrics[selectedMetricIndex])
  }
}

drawBars()