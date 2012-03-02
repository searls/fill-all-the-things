
/*
fill-all-the-things 0.0.1
Fills out forms with dummy data
site: https://github.com/searls/fill-all-the-things

@depend ../vendor/jquery-no-conflict.min.js
*/

(function() {
  var f;

  f = window.FillAllTheThings = window.FillAllTheThings || {};

  f.fill = function() {
    var $, $inputs;
    $ = f.$;
    return $inputs = $(':input:visible:enabled').val(function(i, val) {
      var it;
      it = $(this);
      if (it.is(':checkbox,:radio')) {
        return it.attr('checked', 'checked');
      } else if (it.is('select')) {
        return it.find('option[value="1975"],option:last').val();
      } else if (it.is(':password')) {
        return "f1llTh!NG$?";
      } else if (it.is('[type="email"]') || /email/i.test(it.attr('name'))) {
        return "fill@llthethings.org";
      } else if (it.is('[type="tel"]')) {
        return "123-456-7890";
      } else if (it.is('[type="url"]')) {
        return "http://www.w3.org";
      } else if (!val) {
        return "Filling a Thing";
      } else {
        return val;
      }
    });
  };

  f.$(function() {
    return f.fill();
  });

}).call(this);
