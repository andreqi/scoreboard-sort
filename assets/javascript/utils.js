var UTILS = {
  formatPoint: function(point) {
    return point.x + " " + point.y; 
  },
};

var STL = {};

STL.map = function() {
  var container = {};
  var size = 0;
  var STLmap = {
    has: function(key) {
      return key in container; 
    },
    get: function(key) {
      return container[key]; 
    },
    put: function(key, value) {
      if (!STLmap.has(key)) {
        size++;
      }
      container[key] = value;
    },
    remove: function(key) {
      if (STLmap.has(key)) {
        size--;
        delete container[key]; 
      }
    },
    clear: function() {
      container = {};
    },
    size: function() {
      return size; 
    },
    forEach: function(f) {
      for (var key in container) {
        f(key);
      } 
    }
  };
  return STLmap;
}

STL.idx = function(map, key, def) {
  if (!map.has(key)) {
    map.put(key, def); 
  } 
  return map.get(key);
};

STL.dispatcher = function() {
  var map = STL.map();
  var STLdispatcher = {
    register: function(key, handler) {
      var handlers = STL.idx(map, key, []);
      handlers.push(handler);
    },
    dispatch: function(key) {
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
};

STL.hashset = function() {
  var map = STL.map();
  var keys = [];
  var STLhash = {
    put: function(key) {
      if (!map.has(key)) {
        keys.push(key);
        map.put(key, 1);
      } 
    },
    forEach: function(f) {
      keys.forEach(f); 
    },
    size: function() {
      return keys.length;  
    },
  };
  return STLhash;
}

var PathBag = function() {
  var points = STL.map(); 
  var pathBag = {
    put: function(key, data) {
      var keyPoints = STL.idx(points, key, []); 
      keyPoints.push(data);
    },
    get: function(key) {
      return points.get(key); 
    },
    getIndex: function(key, index) {
      return points.get(key)[index]; 
    }
  };
  return pathBag;
};

