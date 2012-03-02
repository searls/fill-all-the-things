
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
    var doAll, doFirst, figureOutAValue, mutations, textFills, types;
    types = [
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
          return figureOutAValue(it, val);
        }
      }
    ];
    textFills = [
      {
        test: function(it) {
          return it.is(':password');
        },
        action: function() {
          return "f1llTh!NG$?";
        }
      }, {
        test: function(it) {
          return it.is('[type="email"]') || /email/i.test(it.attr('name'));
        },
        action: function() {
          return "fill@llthethings.org";
        }
      }, {
        test: function(it) {
          return it.is('[type="tel"]');
        },
        action: function() {
          return "123-456-7890";
        }
      }, {
        test: function(it) {
          return it.is('[type="url"]');
        },
        action: function() {
          return "http://www.w3.org";
        }
      }, {
        test: function(it, val) {
          return !val;
        },
        action: function() {
          return "Filling a Thing";
        }
      }, {
        test: function() {
          return true;
        },
        action: function(it, val) {
          return val;
        }
      }
    ];
    mutations = [
      {
        test: function(it) {
          return it.attr('maxlength');
        },
        action: function(it, val) {
          return val.substring(0, it.attr('maxlength'));
        }
      }
    ];
    f.fill = function() {
      var $inputs;
      return $inputs = $(':input:visible:enabled').val(function(i, val) {
        return doFirst(types, [$(this), val]);
      });
    };
    figureOutAValue = function(it, val) {
      val = doFirst(textFills, [it, val]);
      return doAll(mutations, [it, val]);
    };
    doFirst = function(actions, args) {
      var match;
      match = void 0;
      _(actions).find(function(o) {
        if (o.test.apply(this, args)) {
          match = o.action.apply(this, args);
          return true;
        }
      });
      return match;
    };
    doAll = function(actions, args) {
      var thing;
      thing = {
        it: args[0],
        val: args[1]
      };
      _(actions).find(function(o) {
        if (o.test.call(this, thing.it, thing.val)) {
          thing.val = o.action.call(this, thing.it, thing.val);
          return true;
        }
      });
      return thing.val;
    };
    return $(function() {
      return f.fill();
    });
  })(f.$, f._);

}).call(this);
