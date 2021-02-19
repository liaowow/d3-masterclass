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
}

drawScatter()