$(function(){
  d3.json('assets/data/3/scoreboard.json', function(data) {
    var parent = d3.select('#contest');
    contestTrack(parent)
      .attr('width', 1000)
      .attr('height', 600)
      .setData(data.scoreboards, data.contestants, function(contestant){
        return contestant.solved;
      }, data.contests)
      .display();
  });
  $.ajax({
    type: 'get',
    url: 'assets/data/data.in',
  }).done(function(str) {
    var data = parse(str); 
    var parent = d3.select('#paths');
    contestTrack(parent)
      .attr('width', 1200)
      .attr('height', 600)
      .setData(data.scoreboards, data.contestants, function(contestant){
        return contestant.points;
      })
      .display();
  });
}())

