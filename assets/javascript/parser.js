var parse = function(file) {
  var lines = file.split('\n');
  var contest = [];
  var contestants = [];
  lines.forEach(function(line) {
    var tokens = line.trim().split(/\s+/); 
    var name = tokens[0], points = tokens.slice(1);
    if (name) {
      contestants.push(name);
    }
    var sum = 0;
    points.forEach(function(acum, index) {
      if (contest.length <= index) {
        contest.push([]);
      }
      sum += parseFloat(acum);
      contest[index].push({
        handle: name, 
        points: sum,
      });
    });  
  });
  contest.forEach(function(scoreboard) {
    scoreboard.sort(function(a, b) { return b.points - a.points}); 
  });
  return {
    scoreboards: contest,
    contestants: contestants,
  };
}

