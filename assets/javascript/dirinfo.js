var Dirinfo = function() {
  var $tablist = $('#tablist');

  $tablist.find('a').on('click', selectTab);

  function selectTab() {
    //ajax this.id
    cb['selectTab'](this.innerHTML); 
  }

  var cb = {
    'selectTab': function() {}
  };

  var handler = {
    on: function(name, fun) {
      cb[name] = fun;
    }
  };
  return handler;
};