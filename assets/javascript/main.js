$(function(){
  $.ajax({
    type: 'get',
    url: 'assets/data/data.in',
  }).done(function(str) { 
    var data = parse(str); 
    contestTrack
      .setParent(d3.select('#paths'))
      .attr('width', 1200)
      .attr('height', 600)
      .setData(data)
      .display();
  });
 }())
