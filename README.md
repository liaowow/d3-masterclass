# d3-masterclass
Coding along with Amelia Wattenberger's [Fullstack D3 Masterclass](https://www.newline.co/courses/fullstack-d3-masterclass)

## Chart-drawing Checklist
1. ✅ **Access data**: look at the data structure, decalre how to access the values we'll need
2. ✅ **Create chart dimensions**: declare the physical (i.e. pixels) chart parameters
3. ✅ **Draw canvas**: render the **wrapper** and **bounds** element
4. ✅ **Create scales**: create scales for every data-to-physical attribute in our chart
5. ✅ **Draw data**: render your data elements
6. ✅ **Draw peripherals**: render your axes, labels, legends, annotations, etc
7. ✅ **Set up interactions**: initialize event listeners and create interaction behavior

### Accessor
- Accessor functions convert a single data point into the metric value
```js
const yAccessor = d => d.temperatureMax
```

### Date Time Format
- d3 has a [d3-time-format](https://github.com/d3/d3-time-format) module with methods for parsing and formatting dates
- `d3.timeParse()` method...
  - takes a string specifying a date format, and
  - outputs a function that will parse dates of that format
  ```js
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)
  ```
### [d3-selection](https://github.com/d3/d3-selection)
- `d3.select()` accepts a CSS-selector-like string and returns the first matching DOM element (if any)
  - you can select all elements with a class name (`.class`)
  - you can select all elements with an id name (`#id`), e.g. `d3.select("#wrapper")`
  - you can select all elements with a specific node type, e.g. `d3.select("div")`

### SVG Elements
- Any elements inside of an `<svg>` have to be SVG elements (with the exception of `<foreignObject>` which is fiddly to work with)
- The `<g>` SVG element is not visible on its own, but is used to group other elements. Think of it as the `<div>` of SVG — a wrapper for other elements

### [d3-scale](https://github.com/d3/d3-scale)
- A scale is a function that converts values between two domains.
- Our scale needs two pieces of information:
  - the **domain**: the minimum and maximum input values
  - the **range**: the minimum and maximum output values

### Data joins
- D3 has a selection object that is aware of what elements already exists.
- To tell the selection what our data look like, we'll pass our dataset to the selection's `.data()` method:
```js
const dots = bounds.selectAll("circle")
  .data(data)
```
- When we call `.data()` on our selection, we're **joining our selected elements with our array of data points**. The returned selection will have a list of **existing elements**, **new elements** that need to be added, and **old elements** that need to be removed:
  - our selection object is updated to contain any overlap between existing DOM elements and data points
  - an **_enter** key is added that lists any data points that don't already have an element rendered
  - an **_exit** key is added that lists any data points that are already rendered but aren't in the provided dataset