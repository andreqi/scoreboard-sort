var UTILS = {
  formatPoint: function(point) {
    return point.x + " " + point.y; 
  },
};

var STL = {};

STL.map = function() {
  var container = {};
  var STLmap = {
    has: function(key) {
      return key in container; 
    },
    get: function(key) {
      return container[key]; 
    },
    put: function(key, value) {
      container[key] = value;
    },
    remove: function(key) {
      if (STLmap.has(key)) {
        delete container[key]; 
      }
    },
    clear: function() {
      container = {};
    },
  };
  return STLmap;
}

STL.idx = function(map, key, def) {
  if (!map.has(key)) {
    map.put(key, def); 
  } 
  return map.get(key);
}

STL.dispatcher = function () {
  var map = STL.map();
  var STLdispatcher = {
    register: function (key, handler) {
      var handlers = STL.idx(map, key, []);
      handlers.push(handler);
    },
    dispatch: function (key) {
      if (map.has(key)) {
        var handlers = map.get(key); 
        for (var i = 0, l = handlers.length; i < l; i++) {
          handlers[i]();
        }
      }
    },
    remove: function (key) {
      map.remove(key); 
    },
    clear: map.clear,
  };
  return STLdispatcher;
}

