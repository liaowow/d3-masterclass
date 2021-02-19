import * as d3 from "d3";

async function drawScatter() {
  // 1. access data
  const data = await d3.json("./data/nyc_weather_data.json")
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  const colorAccessor = d => d.cloudCover
  
  // 2. create chart dimensions
  const width = d3.min([
    window.innerWith * 0.9,
    window.innerHeight * 0.9,
  ])
  const dimensions = {
    width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    }
  }
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.right - dimensions.margin.left
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top - dimensions.margin.bottom
  
  // 3. draw canvas
  const wrapper = d3.select('#wrapper')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    // .style("border", "1px dotted")

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
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()
  //// create color scale
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(data, colorAccessor))
    .range(["skyblue", "darkslategrey"])

  // 5. draw data
  const dots = bounds.selectAll("circle")
        .data(data)
      
  dots.join("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", d => colorScale(colorAccessor(d)))
    .attr("opacity", "0.8")

  // 6. draw peripherals
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
  
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
      dimensions.boundedHeight
    }px)`)
  
  const xAxisLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)")
  
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)
  
  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
  
  const yAxisLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Relative Humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
}

drawScatter()