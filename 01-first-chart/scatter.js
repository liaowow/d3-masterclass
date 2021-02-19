import * as d3 from "d3";

async function drawScatter() {
  // 1. access data
  const data = await d3.json("./data/nyc_weather_data.json")
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  
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
    .style("border", "1px solid")

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

  // 5. draw data
  const dots = bounds.selectAll("circle")
        .data(data)
      
  dots.join("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", "cornflowerblue")
    .attr("opacity", "0.5")

}

drawScatter()