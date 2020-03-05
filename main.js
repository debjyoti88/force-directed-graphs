var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var graph = {
  nodes: [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" },
    { name: "David" },
    { name: "Eve" },
    { name: "Frank" },
  ],

  links: [
    { source: "Alice", target: "Bob" },
    { source: "Alice", target: "Eve" },
    { source: "Bob", target: "Frank" },
    { source: "Charlie", target: "David" }
  ]
};

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function (d) { return d.name; }))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));

var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")

var node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(graph.nodes)
  .enter()
  .append("g")

var circles = node
  .append("circle")
  .attr("r", 10)
  .attr("fill", "green")
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

var lables = node.append("text")
  .text(function (d) {
    return d.name;
  })
  .attr('x', 10)
  .attr('y', 5);

simulation
  .nodes(graph.nodes)
  .on("tick", ticked);

simulation.force("link")
  .links(graph.links);

function ticked() {
  link
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

  node
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
}

function dragstarted(d) {
  console.log('drag event started')
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  console.log('simulation alpha', simulation.alpha())
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  console.log('drag event ended')
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}