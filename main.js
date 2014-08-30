$(function(){
  var data = d3.range(4).map(function(id) { 
    var order = d3.shuffle(d3.range(20));
    return order.map(function(cid, pos){ 
      return {handle: 'c'+cid, points: pos}; 
    });
  });
  var data = 
[[{"handle":"AlejoJesus1994","points":0.0},{"handle":"kvaleriano","points":7.0},{"handle":"eduardovp97","points":0.0},{"handle":"brutaka","points":0.0},{"handle":"Robert_Alonso","points":7.0},{"handle":"Lucas97","points":5.0},{"handle":"wingerlion","points":0.0},{"handle":"Slsvcn","points":3.5},{"handle":"Gerard901","points":1.75},{"handle":"The_Blitz","points":5.5},{"handle":"jael860","points":6.75},{"handle":"polomaster","points":1.0},{"handle":"Dan212P","points":3.5},{"handle":"juanjo12x","points":6.75},{"handle":"mg423","points":0.0},{"handle":"itu","points":6.0},{"handle":"hailo","points":7.5},{"handle":"jafc","points":6.5},{"handle":"Dito9","points":0.5},{"handle":"wirox91","points":0.0},{"handle":"Rxcso","points":6.75},{"handle":"kirasam","points":6.75}],[{"handle":"AlejoJesus1994","points":0.0},{"handle":"kvaleriano","points":18.0},{"handle":"eduardovp97","points":0.0},{"handle":"brutaka","points":0.0},{"handle":"Robert_Alonso","points":17.0},{"handle":"Lucas97","points":11.0},{"handle":"wingerlion","points":0.0},{"handle":"Slsvcn","points":7.5},{"handle":"Gerard901","points":3.75},{"handle":"The_Blitz","points":13.0},{"handle":"jael860","points":14.25},{"handle":"polomaster","points":2.0},{"handle":"Dan212P","points":4.5},{"handle":"juanjo12x","points":17.75},{"handle":"mg423","points":0.0},{"handle":"itu","points":13.5},{"handle":"hailo","points":20.5},{"handle":"jafc","points":15.5},{"handle":"Dito9","points":8.5},{"handle":"wirox91","points":1.0},{"handle":"Rxcso","points":18.75},{"handle":"kirasam","points":16.75}],[{"handle":"AlejoJesus1994","points":0.0},{"handle":"kvaleriano","points":24.5},{"handle":"eduardovp97","points":0.0},{"handle":"brutaka","points":0.0},{"handle":"Robert_Alonso","points":25.0},{"handle":"Lucas97","points":11.0},{"handle":"wingerlion","points":0.0},{"handle":"Slsvcn","points":10.5},{"handle":"Gerard901","points":4.75},{"handle":"The_Blitz","points":14.0},{"handle":"jael860","points":18.75},{"handle":"polomaster","points":2.0},{"handle":"Dan212P","points":7.5},{"handle":"juanjo12x","points":19.25},{"handle":"mg423","points":0.0},{"handle":"itu","points":19.0},{"handle":"hailo","points":26.5},{"handle":"jafc","points":20.0},{"handle":"Dito9","points":8.5},{"handle":"wirox91","points":1.0},{"handle":"Rxcso","points":26.25},{"handle":"kirasam","points":20.75}]];
  contestTrack
    .setParent(d3.select('#paths'))
    .attr('width', 1200)
    .attr('height', 600)
    .setData(data)
    .display();

 }())
