$(function(){
  var parentcontest = d3.select('#contest');
  var contest = contestTrack(parentcontest);
  d3.json('assets/data/8/scoreboard.json', function(data) {
    contest
      .attr('width', 1100)
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

  var cache = {};

  Dirinfo.on('selectTab', function(content) {
    var id = content[content.length-1];
    var data = [];
    var reloadTab = function(d) {
      contest.attr('width', 1100)
             .attr('height', 600)
             .setData(
               d.scoreboards, 
               d.contestants, 
               function(contestant){
                 return contestant.solved;
               }, 
               d.contests)
              .display();
    };

    if (cache[id]) {
      data = cache[id]; 
      reloadTab(data);
    } else {
      d3.json('assets/data/'+ id +'/scoreboard.json', function(d) {
        cache[id] = d;
        reloadTab(d);
      });
    }
  });
}())

