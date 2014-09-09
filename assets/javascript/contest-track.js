/*
 * scoreboard = [{handle: rata, points: 10}]
 */

var contestTrack = function(D3parent) {
  var paths = {};
  var pathData = {};
  var showDispatcher = STL.dispatcher();
  var hideDispatcher = STL.dispatcher();
  var pathBag = PathBag();
  var contestants = STL.hashset();
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
  var D3view = D3parent.append('g');
  var D3lasttips = D3parent.append('g');
  var D3contestLabels = D3parent.append('g');
  var D3tooltips = D3parent.append('g'); 
  
  var track = {
    setData: function(d, contestantList, getLabel, labels) {
      track.setHandles(contestantList);
      d.forEach(function(scoreboard, indexS) {
        var label = indexS+1 == d.length ? 
                    'Wiki' : 'Contest ' + (indexS+1);
        if (labels) {
          label = labels[indexS]; 
        }
        //scoreboard.sort(function(a, b) {
        //  return b.points - a.points; 
        //});
        track.push(label, scoreboard, getLabel);
      });
      return track;
    }, 
    setHandles: function(contestantList) {
      contestantList.forEach(function(name) { 
        contestants.put(name); 
      });
    },
    push: function (label, scoreboard, getLabel) {
      pathBag.put('contestLabel', label);
      contests++;
      scoreboard.forEach(function(contestant, place) {
        pathBag.put(contestant.handle, {
          place: place + 1, 
          tooltip: (place+1) + 'º ' + getLabel(contestant) 
        }); 
      });
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
      contestants.forEach(function(handle) {
        var data = pathBag.getIndex(handle, index);
        var place = data.place;
        var point = getPoint(place, index);
        point = transform(point);

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
        var D3tooltipContainer = D3lasttips.append('g');
        var tooltip = D3tooltip(D3tooltipContainer);

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
      var path = pathBag.get('contestLabel');
      for (var index = begin; index < end; index++) {
        var point = getPoint(0, index); 
        point = transform(point);
        var container = D3contestLabels.append('g');
        var tooltip = D3tooltip(container)
          .attr('h-padding', 10)
          .attr('text-content', path[index])
          .attr('display-triangle', false)
          .translate(point)
          .display();

        container
          .classed('contest-label-container', true);
      }
    },
    displayPaths: function(begin, end, transform) {
      var ttips = [];
      for (var index = begin; index < end; index++) {
        ttips.push(D3tooltip(D3tooltips.append('g'))); 
        ttips[index-begin].attr('h-padding', 5);
      }

      function hideTooltip(tooltip) {
        return function() {
          tooltip.hide(); 
        }; 
      }

      function showTooltip(tooltip, point, label) {
         return function() {
           tooltip.translate(point)
                  .attr('h-padding', 5)
                  .attr('text-content', label)
                  .display();
         }; 
      };

      contestants.forEach(function(handle) {
        var path = [];
        var data = pathBag.get(handle);
        for (var index = begin; index < end; index++) {
          var contestant = data[index]; 
          var point = transform(getPoint(contestant.place, index)); 
          path.push(point);
          var id = index - begin;
          var tooltipPos = {
            x: point.x,
            y: point.y - track.getAttr('tip-offsetY'),
          };
          var label = contestant.tooltip; 

          showDispatcher.register(
            handle, 
            showTooltip(ttips[id], tooltipPos, label)
          );
          hideDispatcher.register(
            handle, 
            hideTooltip(ttips[id])
          );
        } 

        hideDispatcher.register(handle, function() {
          D3path.classed('selected', false); 
        });
        showDispatcher.register(handle, function() {
          D3path.classed('selected', true); 
        });

        var D3path = D3view
                  .append('path')
                    .attr('d', formatPath(path))
                    .attr('fill', 'transparent')
                    .style('pointer-events', 'stroke');

        D3path.on('mouseover', function() {
          showDispatcher.dispatch(handle);
        });
        D3path.on('mouseout', function() {
          hideDispatcher.dispatch(handle);
        });

        path.forEach(function(point) {
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
    displayRange: function(begin, end) {
      D3view.selectAll('*').remove();
      D3tooltips.selectAll('*').remove();
      showDispatcher.clear();
      hideDispatcher.clear();
      var scale = function(point) {
        var points = end - begin;
        var width = (points - 1) * track.getAttr('offsetX');
        var height = (contestants.size()) * track.getAttr('offsetY');
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
      track.displayPaths(begin, end, transform);
      return track;
    },
    display: function() {
      return track.displayRange(0, contests);
    }
  };

  function getPoint(row, col) {
    var offsetX = track.getAttr('offsetX');
    var offsetY = track.getAttr('offsetY');
    return {
      x: offsetX * (col),
      y: offsetY * (row), 
    }; 
  }

  function add(a, b) {
    return {x: a.x + b.x, y: a.y + b.y}; 
  }

  function getCubicPoints(a, b) {
    return [
      {x: (b.x + a.x)/2, y: a.y}, 
      {x: (a.x + b.x)/2, y: b.y}, 
      b,
    ];
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
};
