
/*
fill-all-the-things 0.0.1
Fills out forms with dummy data
site: https://searls.github.com/fill-all-the-things

@depend ../vendor/jquery-no-conflict.js
@depend ../vendor/underscore-no-conflict.js
*/

(function() {
  var f;

  f = window.FillAllTheThings || (window.FillAllTheThings = {});

  (function($, _) {
    f.actions = [
      {
        test: function(it) {
          return it.is(':checkbox,:radio');
        },
        action: function(it) {
          return it.attr('checked', 'checked');
        }
      }, {
        test: function(it) {
          return it.is('select');
        },
        action: function(it) {
          return it.find('option[value="1975"],option:last').val();
        }
      }, {
        test: function() {
          return true;
        },
        action: function(it, val) {
          return f.figureOutAValue(it, val);
        }
      }
    ];
    f.fill = function() {
      var $inputs;
      return $inputs = $(':input:visible:enabled').val(function(i, val) {
        var it, newVal;
        it = $(this);
        newVal = val;
        _(f.actions).find(function(o) {
          if (o.test(it, val)) {
            newVal = o.action(it, val);
            return true;
          }
        });
        return newVal;
      });
    };
    f.figureOutAValue = function(it, val) {
      if (it.is(':password')) {
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
    };
    return $(function() {
      return f.fill();
    });
  })(f.$, f._);

}).call(this);
