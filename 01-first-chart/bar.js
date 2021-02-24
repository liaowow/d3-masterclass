import * as d3 from "d3";

async function drawBars() {
  // 1. access data
  const data = await d3.json("./data/nyc_weather_data.json")
  const xAccessor = d => d.humidity
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

}

drawBars()