/*
 * scoreboard = [{handle: rata, points: 10}]
 */

var contestTrack = function() {
  var paths = {};
  var pathData = {};
  var showDispatcher = STL.dispatcher();
  var hideDispatcher = STL.dispatcher();
  var contestLabel = [];
  var contests = 0;
  var properties = {
    'offsetX': 200, 
    'offsetY': 40,
    'height': 900,
    'width': 500,
    'tip-width': 100,
    'tip-height': 30,
    'tip-offsetY': 20,
    'last-tip-width': 150,
    'last-tip-height': 20,
  };
  var handles = {};
  var tooltips = {};
  var handleOrder = [];
  var handleSize = 0;

  // D3 containers
  var D3view = null;
  var D3tooltips = null;
  var D3lasttips = null;
  var D3contestLabels = null;
  
  var track = {
    setParent: function (D3parent) {
      D3view = D3parent.append('g'); 
      D3contestLabels = D3parent.append('g'); 
      D3lasttips = D3parent.append('g'); 
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
        // first line to labels
        contestLabel.push(getPoint(0, indexS));

        scoreboard.forEach(function(contestant, indexC) {
          if (!handles[contestant.handle]) {
            handles[contestant.handle] = 1; 
            handleOrder.push(contestant.handle);
            handleSize++;
          }
          // first line reserved to contest labels
          pushPoint(contestant.handle, indexC + 1, indexS, {
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
      D3lasttips.selectAll('*').remove();
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
        } else if (place <= 12) {
          team = "runner-up"; 
        }

        var label = place + '° ' + handle;
        var tooltip = D3lasttips.append('g')
          .attr('transform', 'translate(' + 
              (point.x + 10) + ', ' + 
              (point.y - track.getAttr('last-tip-height')/2) + ')');
        var rect = tooltip.append('rect');
        var text = tooltip.append('text')
          .attr('x', 5)
          .attr('y', track.getAttr('last-tip-height')/2 + 5)
          .attr('fill', 'white')
          .text(label);

        tooltip
          .attr('text-content', label)
          .attr('display-triangle', false)
          .attr('h-padding', 5)
          .display();

        D3tooltipContainer
          .on('mouseover', function() { 
            showDispatcher.dispatch(handle); 
          })
          .on('mouseout', function() { 
            hideDispatcher.dispatch(handle); 
          });

        var width = D3tooltipContainer.node().getBBox().width;
        tooltip.translate({ 
          x: point.x + width/2 + 10,
          y: point.y,
        });
        if (team) {
          tooltip.getAttr('rect').classed(team, true); 
        }
      });
    },
    displayContestLabels: function (begin, end, transform) {
      D3contestLabels.selectAll('*').remove();
      showDispatcher.clear();
      hideDispatcher.clear();

      var points = contestLabel.slice(begin, end).map(transform);
      var last = end - begin - 1;
      points.forEach(function(point, index) {
        var container = D3contestLabels.append('g');
        var tooltip = D3tooltip(container)
          .attr('h-padding', 10)
          .attr('text-content', (index != last) ? 'Contest ' + (index+1)
                                                : 'Wiki')
          .attr('display-triangle', false)
          .display();

        container
          .attr('transform', 'translate(' + point.x + ',' + point.y + ')')
          .classed('contest-label-container');

      });
    },
    displayRange: function(begin, end) {
      D3view.selectAll('*').remove();
      D3tooltips.selectAll('*').remove();
      var scale = function(point) {
        var points = end - begin;
        var width = (points - 1) * track.getAttr('offsetX');
        var height = (handleSize) * track.getAttr('offsetY');
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
          y: +10,
        });
      };

      track.displayLastContest(end - 1, transform);
      track.displayContestLabels(begin, end, transform);

      handleOrder.forEach(function(handle, contestantIndex) {
        var path = paths[handle].slice(begin, end).map(transform);
        var D3path = D3view
                  .append('path')
                    .attr('d', formatPath(path))
                    .attr('fill', 'transparent')
                    .style('pointer-events', 'stroke');

        showDispatcher.register(handle, function() {
          showPath(path, pathData[handle], contestantIndex);
          D3path.classed('selected', true); 
        });
        hideDispatcher.register(handle, function() {
          hidePath(contestantIndex, path.length);
          D3path.classed('selected', false); 
        });

        D3path.on('mouseover', function() {
          showDispatcher.dispatch(handle);
        });
        D3path.on('mouseout', function() {
          hideDispatcher.dispatch(handle);
        });

        path.forEach(function(point, contestIndex) {
          D3view.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', 4)
            .on('mouseover', function() { 
              showDispatcher.dispatch(handle); 
            })
            .on('mouseout', function() { 
              hideDispatcher.dispatch(handle); 
            });
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
        y: point.y - track.getAttr('tip-offsetY'),
      }, pData[index]); 
    });
  }

  function hidePath(contestantIndex, times) {
    for (var idx = 0; idx < times; idx++) {
      hideTooltip(contestantIndex, idx); 
    }
  }

  function genKey(contestant, contest) {
    return contestant + '+' + contest; 
  }

  function showTooltip(contestantIndex, contestIndex, point, data) {
    var key = genKey(contestantIndex, contestIndex); 
    var container = D3tooltips.append('g');
    var tooltip = D3tooltip(container); 
    tooltip
      .attr('h-padding', 5)
      .attr('text-content', data.tooltip)
      .display();

    container
      .attr('transform', 'translate(' + point.x + ',' + point.y + ')')

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

  function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y}; 
  }

  function getCubicPoints(a, b) {
    return [{x: (b.x+a.x)/2, y: a.y}, {x: (a.x + b.x)/2, y: b.y}, b];
  }

  function formatPath(path) {
    var stringPath = 'M ' + UTILS.formatPoint(path[0]);
    for (var index = 1; index < path.length; index++) {
      var bezier = getCubicPoints(path[index-1], path[index]);
      stringPath += ' C ' + bezier.map(UTILS.formatPoint).join(' ') 
    }
    return stringPath;
  }
  return track;
}();
