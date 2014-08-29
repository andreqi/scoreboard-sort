/*
 * scoreboard = [{handle: rata, points: 10}]
 */

var contestTrack = function() {
  var paths = {};
  var contests = 0;
  var properties = {
    'offsetX': 200, 
    'offsetY': 40
  };
  var handles = {};
  var handleOrder = [];
  var handleSize = 0;

  var D3view = null;
  
  var track = {
    setParent: function (D3parent) {
      D3view = D3parent.append('g'); 
      return track;
    },
    setData: function(d) {
      contests = data.length;
      handles = {};
      data.forEach(function(scoreboard, indexS) {
        scoreboard.sort(function(a, b) {
          return a.points - b.points; 
        });
        scoreboard.forEach(function(contestant, indexC) {
          if (!handles[contestant.handle]) {
            handles[contestant.handle] = 1; 
            handleOrder.push(contestant.handle);
            handleSize++;
          }
          pushPoint(contestant.handle, indexC, indexS);
        });
      });
      return track;
    }, 
    attr: function(propName, value) {
      properties[propName] = value;
      return track; 
    },
    displayRange: function(begin, end) {
      D3view.selectAll('*').remove();
      translate = function(point) {
        return {
          x: point.x - begin * properties['offsetX'],
          y: point.y
        }  
      };
      handleOrder.forEach(function(handle) {
        var path = paths[handle].slice(begin, end).map(translate);
        var D3path = D3view
                  .append('path')
                    .attr('d', formatPath(path))
                    .attr('fill', 'transparent')
                    .style('pointer-events', 'stroke');
        applyIdleStyle(D3path);
        D3path.on('mouseover', function() {
          applySelectedStyle(D3path); 
        });
        D3path.on('mouseout', function() {
          applyIdleStyle(D3path);
        });

        path.forEach(function(point) {
          D3view.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', 4)
            .attr('fill', 'red') 
            .style('pointer-events', 'stroke')
            .on('mouseover', function() { 
              applySelectedStyle(D3path); 
            })
            .on('mouseout', function() { applyIdleStyle(D3path); })

          // TODO: add applyCircleStyle
        });
      });
      return track;
    }
  };

  function applyIdleStyle(D3path) {
    D3path.attr('stroke', 'black')
          .attr('stroke-width', 2); 
  }

  function applySelectedStyle(D3path) {
    D3path.attr('stroke', 'steelblue')
          .attr('stroke-width', 6);
  }
 
  function pushPoint(contestantID, row, col) {
    if (!paths[contestantID]) {
      paths[contestantID] = []; 
    } 
    var path = paths[contestantID];
    path.push(getPoint(row, col));
  }

  function getPoint(row, col) {
    var offsetX = properties['offsetX'];
    var offsetY = properties['offsetY'];
    return {
      x: offsetX * (col) + 10,
      y: offsetY * (row + 1) 
    }; 
  }

  function formatPoint(point) {
    return +point.x + " " + +point.y; 
  }

  function getCubicPoints(a, b) {
    return [{x: (b.x+a.x)/2, y: a.y}, {x: (a.x + b.x)/2, y: b.y}, b];
  }

  function formatPath(path) {
    var stringPath = 'M ' + formatPoint(path[0]);
    for (var index = 1; index < path.length; index++) {
      var bezier = getCubicPoints(path[index-1], path[index]);
      stringPath += ' C ' + bezier.map(formatPoint).join(' ') 
                    
    }
    return stringPath;
  }
  return track;
}();
