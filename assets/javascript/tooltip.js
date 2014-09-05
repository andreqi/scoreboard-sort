function D3tooltip(D3container) {
  var D3view = D3container;
  var D3tooltip = D3view.append('g');
  var D3rect = D3tooltip.append('rect');
  var D3text = D3tooltip.append('text');
  var D3triangle = D3tooltip.append('polygon');

  var properties = {
    'width': null,
    'height': null,
    'triangle-size': 5,
    'v-padding': 10,
    'h-padding': 0,
    'rect': D3rect,
    'text': D3text,
    'triangle': D3triangle,
    'text-content': 'placeholder',
    'display-triangle': true,
  };

  var tooltip = {
    attr: function(name, value) {
      // bypass everything to the container (D3tooltip)
      properties[name] = value;     
      return tooltip;
    },
    getAttr: function(name) {
      return properties[name]; 
    },
    displayText: function() {
      D3text
        .attr('text-anchor', 'middle')
        .attr('x', 0) 
        .attr('y', 5) 
        .attr('fill', 'white')
        .text(tooltip.getAttr('text-content'));
      return tooltip;
    },
    displayRect: function() {
      var box = D3text.node().getBBox(); 
      var height = (tooltip.getAttr('height') || box.height)
                   + tooltip.getAttr('h-padding');
      var width = (tooltip.getAttr('width') || box.width)   
                  + tooltip.getAttr('v-padding');
      D3rect
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('height', height)
        .attr('width', width)
        .attr('x', -width/2)
        .attr('y', -height/2);
      return tooltip;
    },
    displayTriangle: function() {
      var height = D3rect.attr('height');
      var offset = tooltip.getAttr('triangle-size');
      var vertex = {
        x: 0,
        y: height/2 + offset - 1,
      };
      D3triangle
        .attr('points', [
            {
              x: vertex.x - offset, 
              y: vertex.y - offset,
            },
            vertex,
            {
              x: vertex.x + offset, 
              y: vertex.y - offset,
            },
          ].map(UTILS.formatPoint).join(' '));
      return tooltip;
    },
    display: function() {
      // the order matters
      tooltip
        .displayText()
        .displayRect();
      if (tooltip.getAttr('display-triangle')) {
        tooltip.displayTriangle();
      }
      return tooltip;
    },
    remove: function() {
      D3container.remove();  
    },
  };
  return tooltip;
}
