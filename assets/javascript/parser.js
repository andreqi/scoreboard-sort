var parse = function(file) {
  var lines = file.split('\n');
  var contest = [];
  lines.forEach(function(line) {
    var tokens = line.trim().split(/\s+/); 
    var name = tokens[0], points = tokens.slice(1);
    var sum = 0;
    points.forEach(function(acum, index) {
      if (contest.length <= index) {
        contest.push([]);
      }
      contest[index].push({
        handle: name, 
        points: parseFloat(acum),
      });
    });  
  });
  return contest;
}

