import * as d3 from "d3";

async function drawScatter() {
  const data = await d3.json("./data/nyc_weather_data.json")
  
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  
  console.log(yAccessor(data[0]))
}

drawScatter()