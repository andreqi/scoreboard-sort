/*
 * scoreboard = [{handle: rata, points: 10}]
 */

var contestTrack = function() {
  var paths = {};
  var pathData = {};
  var contests = 0;
  var properties = {
    'offsetX': 200, 
    'offsetY': 40,
    'height': 900,
    'width': 500,
    'tip-width': 100,
    'tip-height': 30,
    'tip-offsetY': 15,
    'last-tip-width': 150,
    'last-tip-height': 20,
  };
  var handles = {};
  var tooltips = {};
  var handleOrder = [];
  var handleSize = 0;

  var D3view = null;
  var D3tooltips = null;
  
  var track = {
    setParent: function (D3parent) {
      D3view = D3parent.append('g'); 
      D3tooltips = D3parent.append('g'); 
      return track;
    },
    setData: function(d) {
      data = d;
      contests = data.length;
      handles = {};
      data.forEach(function(scoreboard, indexS) {
        scoreboard.sort(function(a, b) {
          return -a.points + b.points; 
        });
        scoreboard.forEach(function(contestant, indexC) {
          if (!handles[contestant.handle]) {
            handles[contestant.handle] = 1; 
            handleOrder.push(contestant.handle);
            handleSize++;
          }
          pushPoint(contestant.handle, indexC, indexS, {
            tooltip: (indexC+1) + '° ' + contestant.points, 
            handle: contestant.handle,
            place: indexC + 1,
          });
        });
      });
      return track;
    }, 
    attr: function(propName, value) {
      properties[propName] = value;
      return track; 
    },
    getAttr: function(propName) {
      return properties[propName]; 
    },
    displayLastContest: function (index, transform) {
      handleOrder.forEach(function(handle) {
        var point = transform(paths[handle][index]);
        var place = pathData[handle][index].place;
        var team="";
        if (place <= 3) {
          team = "gold"; 
        } else if (place <= 6) {
          team = "silver";
        } else if (place <= 9) {
          team = "bronze"; 
        }

        var label = place + '° ' + handle;
        var tooltip = D3tooltips.append('g')
          .attr('transform', 'translate(' + 
              (point.x + 10) + ', ' + 
              (point.y - track.getAttr('last-tip-height')/2) + ')');
        var rect = tooltip.append('rect');
        var text = tooltip.append('text')
          .attr('x', 5)
          .attr('y', track.getAttr('last-tip-height')/2 + 5)
          .attr('fill', 'white')
          .text(label);

        rect
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('width', text.node().getBBox().width + 10)
          .attr('height', track.getAttr('last-tip-height'));
         if (team) {
           rect.classed(team, true); 
         }
      });
    },
    displayRange: function(begin, end) {
      D3view.selectAll('*').remove();
      D3tooltips.selectAll('*').remove();
      var scale = function(point) {
        var points = end - begin;
        var width = (points - 1) * track.getAttr('offsetX');
        var height = (handleSize - 1) * track.getAttr('offsetY');
        var scaleX = (track.getAttr('width') - 120) / width;
        var scaleY = (track.getAttr('height') - 20) / height;
        return {
          x: point.x * scaleX, 
          y: point.y * scaleY
        };
      };
      var translate = function(point, dir) {
        return {
          x: point.x + dir.x,
          y: point.y + dir.y
        }  
      };
      var transform = function(point) {
        var p1 = translate(point, {
          x: -begin * track.getAttr('offsetX'), 
          y: 0
        }); 
        var p2 = scale(p1);
        return translate(p2, {
          x: +10, 
          y: +10
        });
      };
      track.displayLastContest(end - 1, transform);
      handleOrder.forEach(function(handle, contestantIndex) {
        var path = paths[handle].slice(begin, end).map(transform);
        var D3path = D3view
                  .append('path')
                    .attr('d', formatPath(path))
                    .attr('fill', 'transparent')
                    .style('pointer-events', 'stroke');
        applyIdleStyle(D3path);
        D3path.on('mouseover', function() {
          showPath(path, pathData[handle], contestantIndex);
          applySelectedStyle(D3path); 
        });
        D3path.on('mouseout', function() {
          hidePath(contestantIndex, path.length);
          applyIdleStyle(D3path);
        });

        path.forEach(function(point, contestIndex) {
          D3view.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', 4)
            .on('mouseover', function() { 
              showPath(path, pathData[handle], contestantIndex);
              /*showTooltip(contestantIndex, contestIndex, {
                x: point.x - track.getAttr('tip-width')/2, 
                y: point.y - track.getAttr('tip-height') 
                           - track.getAttr('tip-offsetY'),
              }, pathData[handle][contestIndex]);*/
              applySelectedStyle(D3path); 
            })
            .on('mouseout', function() { 
              hidePath(contestantIndex, path.length);
              //hideTooltip(contestantIndex, contestIndex);
              applyIdleStyle(D3path); 
            })
          // TODO: add applyCircleStyle
        });
      });
      return track;
    },
    display: function() {
      return track.displayRange(0, data.length);
    }
  };

  function showPath(path, pData, contestantIndex) {
    path.forEach(function(point, index) {
      showTooltip(contestantIndex, index, {
        x: point.x, 
        y: point.y - track.getAttr('tip-height')/1.5 
                   - track.getAttr('tip-offsetY'),
      }, pData[index]); 
    });
  }

  function hidePath(contestantIndex, times) {
    for (var idx = 0; idx < times; idx++) {
      hideTooltip(contestantIndex, idx); 
    }
  }

  function applyIdleStyle(D3path) {
    D3path.classed('selected', false);
  }

  function applySelectedStyle(D3path) {
    D3path.classed('selected', true);
  }

  function genKey(contestant, contest) {
    return contestant + '+' + contest; 
  }

  function showTooltip(contestantIndex, contestIndex, point, data) {
    var key = genKey(contestantIndex, contestIndex); 
    var tooltip = 
      D3tooltips.append('g')
      .attr('transform', 'translate(' + point.x + ',' + point.y + ')')
      .attr('id', key);  

    var rect = 
      tooltip.append('rect')
        .attr('rx', 5)
        .attr('ry', 5)
        .classed('point-tip', true)

    var offset = track.getAttr('tip-offsetY')*.5;

    var text = tooltip.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 0) 
      .attr('y', track.getAttr('tip-height')/2 + 5) 
      .attr('fill', 'white')
      .text(data.tooltip);

    var box = text.node().getBBox();
    var width = box.width + 10, height = box.height + 5;
    
    rect.attr('width', width)
        .attr('height', height) 
        .attr('x', -width/2)
        .attr('y', height/2 - offset);
  
    var vertex = {
      x: 0,
      y: height + offset,
    };

    var triangle = 
      tooltip.append('polygon')
      .classed('point-tip', true)
      .attr('points', [
          add(vertex, {x:-offset, y: -offset}),
          vertex,
          add(vertex, {x: offset, y: -offset}),
      ].map(formatPoint).join(' '));

    tooltips[key] = tooltip;
  }

  function hideTooltip(contestantIndex, contestIndex) {
    var key = genKey(contestantIndex, contestIndex); 
    tooltips[key].remove();
  }

  function pushPoint(contestantID, row, col, data) {
    if (!paths[contestantID]) {
      paths[contestantID] = []; 
      pathData[contestantID] = []
    } 
    var path = paths[contestantID];
    path.push(getPoint(row, col));
    pathData[contestantID].push(data);
  }

  function getPoint(row, col) {
    var offsetX = track.getAttr('offsetX');
    var offsetY = track.getAttr('offsetY');
    return {
      x: offsetX * (col),
      y: offsetY * (row) 
    }; 
  }

  function formatPoint(point) {
    return point.x + " " + point.y; 
  }

  function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y}; 
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
