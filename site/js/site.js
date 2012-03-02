(function($){
  var f = window.FillAllTheThings = window.FillAllTheThings || {}
  f.Site = function(){
    var self = {};

    self.sprinkleBookmarklet = function() {
      var url = bookmarkletify("http://searls.github.com/fill-all-the-things/dist/fill-all-the-things.min.js");
      window.location.hash = url;
      $('a.bookmarklet').attr('href', url);
    };

    self.preventDirectBookmarkletClicking = function() {
      $('a.bookmarklet').on('click', function(e) {
        e.preventDefault();
        window.alert("You're *this* close!\n\nInstructions:\n\n1. Drag this link to your bookmarks bar\n2. Click the bookmarklet from your bookmarks bar to fill in form fields.");
      });
    };

    self.init = function() {
      self.sprinkleBookmarklet();
      self.preventDirectBookmarkletClicking();
    };

    var bookmarkletify = function(url){
      return "javascript:(function(){var d=document,s=d.createElement('scr'+'ipt');s.src='"+url+"';d.body.appendChild(s);})();";
    }

    return self;
  }

  $(function(){
    f.Site().init()
  });
})(window.jQuery || window.FillAllTheThings.$)

