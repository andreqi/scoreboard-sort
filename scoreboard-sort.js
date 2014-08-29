$(function() {
  var view = d3.select('#pathview');
  var contestants = 20;
  var contests = 20;
  var data = d3.range(contests).map(function(value) {
    var positions = d3.range(contestants);
    return {id: 'contest ' + value, order: d3.shuffle(positions)};    
  });

  var paths = {};
  data.forEach(function(scoreboard, tick) {
    var order = scoreboard.order;
    order.forEach(function(contestantID, index) {
      pushPoint(contestantID, index, tick);
    });
  });

  d3.range(contestants).forEach(function(contestantID) {
    var p = view.append('path')
      .attr('d', formatPath(paths[contestantID]))
      .attr('stroke', 'black')
      .attr('fill', 'transparent') 
      .attr('stroke-width', 2)
      .on('mouseover', function() { 
        p.attr('stroke', 'steelblue'); 
        p.attr('stroke-width', 6); 
      })
      .on('mouseout', function() { 
        p.attr('stroke', 'black'); 
        p.attr('stroke-width', 2); 
      })
      .style('pointer-events', 'stroke');
    paths[contestantID].forEach(function(point) {
      view.append('circle')
        .attr('cx', point.x)
        .attr('cy', point.y)
        .attr('r', 4)
        .attr('fill', 'red');
    });
  });

  function pushPoint(contestantID, row, col) {
    if (!paths[contestantID]) {
      paths[contestantID] = []; 
    } 
    var path = paths[contestantID];
    path.push(getPoint(row, col));
  }

  function getPoint(row, col) {
    var offsetX = 200;
    var offsetY = 40;
    return {
      x: offsetX * (col) + 10,
      y: offsetY * (row + 1) 
    }; 
  }

  function formatPoint(point) {
    return +point.x + " " + +point.y; 
  }

  function add(a, b) {
    return {
      x: (a.x + b.x), 
      y: (a.y + b.y)
    };
  }

  function getCubicPoints(a, b) {
    return [{x: (b.x+a.x)/2, y: a.y}, {x: (a.x + b.x)/2, y: b.y}, b];
  }

  function formatPath(path) {
    var stringPath = "M" + formatPoint(path[0]);
    for (var index = 1; index < path.length; index++) {
      var bezier = getCubicPoints(path[index-1], path[index]);
      stringPath += " C " + bezier.map(formatPoint).join(" ") 
                    
    }
    return stringPath;
  }
}());
