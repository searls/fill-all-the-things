(function($){
  var f = window.FillAllTheThings = window.FillAllTheThings || {}
  f.Site = function(){
    var self = {};

    self.sprinkleBookmarklet = function() {
      var url = bookmarkletify("http://searls.github.com/fill-all-the-things/dist/fill-all-the-things.min.js");
      window.location.hash = url;
    };

    var bookmarkletify = function(url){
      return "javascript:(function(){var d=document,s=d.createElement('scr'+'ipt');s.src='"+url+"';d.body.appendChild(s);})();";
    }

    return self;
  }

  $(function(){
    f.Site().sprinkleBookmarklet()
  });
})(window.jQuery || window.FillAllTheThings.$)

