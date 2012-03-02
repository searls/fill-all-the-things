
/*
fill-all-the-things 0.0.1
Fills out forms with dummy data
site: https://github.com/searls/fill-all-the-things
*/

(function() {

  window.FillAllTheThings = {
    fill: function() {
      var $inputs;
      return $inputs = $(':input:visible').val(function(i, val) {
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
        } else if (!val) {
          return "Filling a Thing";
        } else {
          return val;
        }
      });
    }
  };

  window.FillAllTheThings.fill();

}).call(this);
