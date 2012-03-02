(function() {
  var Zepto;

  Zepto = (function() {
    var $, $$, Z, adjacencyOperators, camelize, classCache, classList, classRE, classSelectorRE, compact, containers, cssNumber, dasherize, defaultDisplay, document, elementDisplay, elementTypes, emptyArray, filtered, flatten, fragment, fragmentRE, funcArg, getComputedStyle, idSelectorRE, insert, isA, isF, isO, key, likeArray, maybeAddPx, readyRE, slice, table, tableRow, tagSelectorRE, traverseNode, uniq;
    isF = function(value) {
      return {}.toString.call(value) === "[object Function]";
    };
    isO = function(value) {
      return value instanceof Object;
    };
    isA = function(value) {
      return value instanceof Array;
    };
    likeArray = function(obj) {
      return typeof obj.length === "number";
    };
    compact = function(array) {
      return array.filter(function(item) {
        return item !== undefined && item !== null;
      });
    };
    flatten = function(array) {
      if (array.length > 0) {
        return [].concat.apply([], array);
      } else {
        return array;
      }
    };
    camelize = function(str) {
      return str.replace(/-+(.)?/g, function(match, chr) {
        if (chr) {
          return chr.toUpperCase();
        } else {
          return "";
        }
      });
    };
    dasherize = function(str) {
      return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    };
    uniq = function(array) {
      return array.filter(function(item, index, array) {
        return array.indexOf(item) === index;
      });
    };
    classRE = function(name) {
      if (name in classCache) {
        return classCache[name];
      } else {
        return classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
      }
    };
    maybeAddPx = function(name, value) {
      if (typeof value === "number" && !cssNumber[dasherize(name)]) {
        return value + "px";
      } else {
        return value;
      }
    };
    defaultDisplay = function(nodeName) {
      var display, element;
      element = void 0;
      display = void 0;
      if (!elementDisplay[nodeName]) {
        element = document.createElement(nodeName);
        document.body.appendChild(element);
        display = getComputedStyle(element, "").getPropertyValue("display");
        element.parentNode.removeChild(element);
        display === "none" && (display = "block");
        elementDisplay[nodeName] = display;
      }
      return elementDisplay[nodeName];
    };
    fragment = function(html, name) {
      var container;
      if (name === undefined) fragmentRE.test(html) && RegExp.$1;
      if (!(name in containers)) name = "*";
      container = containers[name];
      container.innerHTML = "" + html;
      return slice.call(container.childNodes);
    };
    Z = function(dom, selector) {
      dom = dom || emptyArray;
      dom.__proto__ = Z.prototype;
      dom.selector = selector || "";
      return dom;
    };
    $ = function(selector, context) {
      var dom;
      if (!selector) return Z();
      if (context !== undefined) {
        return $(context).find(selector);
      } else if (isF(selector)) {
        return $(document).ready(selector);
      } else if (!(selector instanceof Z)) {
        dom = void 0;
        if (isA(selector)) {
          dom = compact(selector);
        } else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window) {
          dom = [selector];
          selector = null;
        } else if (fragmentRE.test(selector)) {
          dom = fragment(selector.trim(), RegExp.$1);
          selector = null;
        } else if (selector.nodeType && selector.nodeType === 3) {
          dom = [selector];
        } else {
          dom = $$(document, selector);
        }
        return Z(dom, selector);
      }
    };
    filtered = function(nodes, selector) {
      if (selector === undefined) {
        return $(nodes);
      } else {
        return $(nodes).filter(selector);
      }
    };
    funcArg = function(context, arg, idx, payload) {
      if (isF(arg)) {
        return arg.call(context, idx, payload);
      } else {
        return arg;
      }
    };
    insert = function(operator, target, node) {
      var parent;
      parent = (operator % 2 ? target : target.parentNode);
      return parent && parent.insertBefore(node, (!operator ? target.nextSibling : (operator === 1 ? parent.firstChild : (operator === 2 ? target : null))));
    };
    traverseNode = function(node, fun) {
      var key, _results;
      fun(node);
      _results = [];
      for (key in node.childNodes) {
        _results.push(traverseNode(node.childNodes[key], fun));
      }
      return _results;
    };
    key = void 0;
    $$ = void 0;
    classList = void 0;
    emptyArray = [];
    slice = emptyArray.slice;
    document = window.document;
    elementDisplay = {};
    classCache = {};
    getComputedStyle = document.defaultView.getComputedStyle;
    cssNumber = {
      "column-count": 1,
      columns: 1,
      "font-weight": 1,
      "line-height": 1,
      opacity: 1,
      "z-index": 1,
      zoom: 1
    };
    fragmentRE = /^\s*<(\w+)[^>]*>/;
    elementTypes = [1, 9, 11];
    adjacencyOperators = ["after", "prepend", "before", "append"];
    table = document.createElement("table");
    tableRow = document.createElement("tr");
    containers = {
      tr: document.createElement("tbody"),
      tbody: table,
      thead: table,
      tfoot: table,
      td: tableRow,
      th: tableRow,
      "*": document.createElement("div")
    };
    readyRE = /complete|loaded|interactive/;
    classSelectorRE = /^\.([\w-]+)$/;
    idSelectorRE = /^#([\w-]+)$/;
    tagSelectorRE = /^[\w-]+$/;
    $.extend = function(target) {
      slice.call(arguments, 1).forEach(function(source) {
        var key, _results;
        _results = [];
        for (key in source) {
          _results.push(target[key] = source[key]);
        }
        return _results;
      });
      return target;
    };
    $.qsa = $$ = function(element, selector) {
      var found;
      found = void 0;
      if (element === document && idSelectorRE.test(selector)) {
        if ((found = element.getElementById(RegExp.$1))) {
          return [found];
        } else {
          return emptyArray;
        }
      } else {
        return slice.call((classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : (tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector))));
      }
    };
    $.isFunction = isF;
    $.isObject = isO;
    $.isArray = isA;
    $.map = function(elements, callback) {
      var i, key, value, values;
      value = void 0;
      values = [];
      i = void 0;
      key = void 0;
      if (likeArray(elements)) {
        i = 0;
        while (i < elements.length) {
          value = callback(elements[i], i);
          if (value != null) values.push(value);
          i++;
        }
      } else {
        for (key in elements) {
          value = callback(elements[key], key);
          if (value != null) values.push(value);
        }
      }
      return flatten(values);
    };
    $.each = function(elements, callback) {
      var i, key;
      i = void 0;
      key = void 0;
      if (likeArray(elements)) {
        i = 0;
        while (i < elements.length) {
          if (callback(i, elements[i]) === false) return elements;
          i++;
        }
      } else {
        for (key in elements) {
          if (callback(key, elements[key]) === false) return elements;
        }
      }
      return elements;
    };
    $.fn = {
      forEach: emptyArray.forEach,
      reduce: emptyArray.reduce,
      push: emptyArray.push,
      indexOf: emptyArray.indexOf,
      concat: emptyArray.concat,
      map: function(fn) {
        return $.map(this, function(el, i) {
          return fn.call(el, i, el);
        });
      },
      slice: function() {
        return $(slice.apply(this, arguments));
      },
      ready: function(callback) {
        if (readyRE.test(document.readyState)) {
          callback($);
        } else {
          document.addEventListener("DOMContentLoaded", (function() {
            return callback($);
          }), false);
        }
        return this;
      },
      get: function(idx) {
        if (idx === undefined) {
          return this;
        } else {
          return this[idx];
        }
      },
      size: function() {
        return this.length;
      },
      remove: function() {
        return this.each(function() {
          if (this.parentNode != null) return this.parentNode.removeChild(this);
        });
      },
      each: function(callback) {
        this.forEach(function(el, idx) {
          return callback.call(el, idx, el);
        });
        return this;
      },
      filter: function(selector) {
        return $([].filter.call(this, function(element) {
          return element.parentNode && $$(element.parentNode, selector).indexOf(element) >= 0;
        }));
      },
      end: function() {
        return this.prevObject || $();
      },
      andSelf: function() {
        return this.add(this.prevObject || $());
      },
      add: function(selector, context) {
        return $(uniq(this.concat($(selector, context))));
      },
      is: function(selector) {
        return this.length > 0 && $(this[0]).filter(selector).length > 0;
      },
      not: function(selector) {
        var excludes, nodes;
        nodes = [];
        if (!(isF(selector) && selector.call !== undefined)) {
          excludes = (typeof selector === "string" ? this.filter(selector) : (likeArray(selector) && isF(selector.item) ? slice.call(selector) : $(selector)));
          this.forEach(function(el) {
            if (excludes.indexOf(el) < 0) return nodes.push(el);
          });
        }
        return $(nodes);
      },
      eq: function(idx) {
        if (idx === -1) {
          return this.slice(idx);
        } else {
          return this.slice(idx, +idx + 1);
        }
      },
      first: function() {
        var el;
        el = this[0];
        if (el && !isO(el)) {
          return el;
        } else {
          return $(el);
        }
      },
      last: function() {
        var el;
        el = this[this.length - 1];
        if (el && !isO(el)) {
          return el;
        } else {
          return $(el);
        }
      },
      find: function(selector) {
        var result;
        result = void 0;
        if (this.length === 1) {
          result = $$(this[0], selector);
        } else {
          result = this.map(function() {
            return $$(this, selector);
          });
        }
        return $(result);
      },
      closest: function(selector, context) {
        var candidates, node;
        node = this[0];
        candidates = $$(context || document, selector);
        if (!candidates.length) node = null;
        while (node && candidates.indexOf(node) < 0) {
          node = node !== context && node !== document && node.parentNode;
        }
        return $(node);
      },
      parents: function(selector) {
        var ancestors, nodes;
        ancestors = [];
        nodes = this;
        while (nodes.length > 0) {
          nodes = $.map(nodes, function(node) {
            if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
              ancestors.push(node);
              return node;
            }
          });
        }
        return filtered(ancestors, selector);
      },
      parent: function(selector) {
        return filtered(uniq(this.pluck("parentNode")), selector);
      },
      children: function(selector) {
        return filtered(this.map(function() {
          return slice.call(this.children);
        }), selector);
      },
      siblings: function(selector) {
        return filtered(this.map(function(i, el) {
          return slice.call(el.parentNode.children).filter(function(child) {
            return child !== el;
          });
        }), selector);
      },
      empty: function() {
        return this.each(function() {
          return this.innerHTML = "";
        });
      },
      pluck: function(property) {
        return this.map(function() {
          return this[property];
        });
      },
      show: function() {
        return this.each(function() {
          this.style.display === "none" && (this.style.display = null);
          if (getComputedStyle(this, "").getPropertyValue("display") === "none") {
            return this.style.display = defaultDisplay(this.nodeName);
          }
        });
      },
      replaceWith: function(newContent) {
        return this.each(function() {
          return $(this).before(newContent).remove();
        });
      },
      wrap: function(newContent) {
        return this.each(function() {
          return $(this).wrapAll($(newContent)[0].cloneNode(false));
        });
      },
      wrapAll: function(newContent) {
        if (this[0]) {
          $(this[0]).before(newContent = $(newContent));
          newContent.append(this);
        }
        return this;
      },
      unwrap: function() {
        this.parent().each(function() {
          return $(this).replaceWith($(this).children());
        });
        return this;
      },
      hide: function() {
        return this.css("display", "none");
      },
      toggle: function(setting) {
        if ((setting === undefined ? this.css("display") === "none" : setting)) {
          return this.show();
        } else {
          return this.hide();
        }
      },
      prev: function() {
        return $(this.pluck("previousElementSibling"));
      },
      next: function() {
        return $(this.pluck("nextElementSibling"));
      },
      html: function(html) {
        if (html === undefined) {
          if (this.length > 0) {
            return this[0].innerHTML;
          } else {
            return null;
          }
        } else {
          return this.each(function(idx) {
            var originHtml;
            originHtml = this.innerHTML;
            return $(this).empty().append(funcArg(this, html, idx, originHtml));
          });
        }
      },
      text: function(text) {
        if (text === undefined) {
          if (this.length > 0) {
            return this[0].textContent;
          } else {
            return null;
          }
        } else {
          return this.each(function() {
            return this.textContent = text;
          });
        }
      },
      attr: function(name, value) {
        var res;
        res = void 0;
        if (typeof name === "string" && value === undefined) {
          if (this.length === 0) {
            return undefined;
          } else {
            if (name === "value" && this[0].nodeName === "INPUT") {
              return this.val();
            } else {
              if (!(res = this[0].getAttribute(name)) && name in this[0]) {
                return this[0][name];
              } else {
                return res;
              }
            }
          }
        } else {
          return this.each(function(idx) {
            var key, _results;
            if (isO(name)) {
              _results = [];
              for (key in name) {
                _results.push(this.setAttribute(key, name[key]));
              }
              return _results;
            } else {
              return this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
            }
          });
        }
      },
      removeAttr: function(name) {
        return this.each(function() {
          return this.removeAttribute(name);
        });
      },
      data: function(name, value) {
        return this.attr("data-" + name, value);
      },
      val: function(value) {
        if (value === undefined) {
          if (this.length > 0) {
            return this[0].value;
          } else {
            return null;
          }
        } else {
          return this.each(function(idx) {
            return this.value = funcArg(this, value, idx, this.value);
          });
        }
      },
      offset: function() {
        var obj;
        if (this.length === 0) return null;
        obj = this[0].getBoundingClientRect();
        return {
          left: obj.left + window.pageXOffset,
          top: obj.top + window.pageYOffset,
          width: obj.width,
          height: obj.height
        };
      },
      css: function(property, value) {
        var css, key;
        if (value === undefined && typeof property === "string") {
          return (this.length === 0 ? undefined : this[0].style[camelize(property)] || getComputedStyle(this[0], "").getPropertyValue(property));
        }
        css = "";
        for (key in property) {
          css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
        }
        if (typeof property === "string") {
          css = dasherize(property) + ":" + maybeAddPx(property, value);
        }
        return this.each(function() {
          return this.style.cssText += ";" + css;
        });
      },
      index: function(element) {
        if (element) {
          return this.indexOf($(element)[0]);
        } else {
          return this.parent().children().indexOf(this[0]);
        }
      },
      hasClass: function(name) {
        if (this.length < 1) {
          return false;
        } else {
          return classRE(name).test(this[0].className);
        }
      },
      addClass: function(name) {
        return this.each(function(idx) {
          var cls, newName;
          classList = [];
          cls = this.className;
          newName = funcArg(this, name, idx, cls);
          newName.split(/\s+/g).forEach((function(klass) {
            if (!$(this).hasClass(klass)) return classList.push(klass);
          }), this);
          return classList.length && (this.className += (cls ? " " : "") + classList.join(" "));
        });
      },
      removeClass: function(name) {
        return this.each(function(idx) {
          if (name === undefined) return this.className = "";
          classList = this.className;
          funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
            return classList = classList.replace(classRE(klass), " ");
          });
          return this.className = classList.trim();
        });
      },
      toggleClass: function(name, when_) {
        return this.each(function(idx) {
          var newName;
          newName = funcArg(this, name, idx, this.className);
          if ((when_ === undefined ? !$(this).hasClass(newName) : when_)) {
            return $(this).addClass(newName);
          } else {
            return $(this).removeClass(newName);
          }
        });
      }
    };
    "filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings".split(",").forEach(function(property) {
      var fn;
      fn = $.fn[property];
      return $.fn[property] = function() {
        var ret;
        ret = fn.apply(this, arguments);
        ret.prevObject = this;
        return ret;
      };
    });
    ["width", "height"].forEach(function(dimension) {
      return $.fn[dimension] = function(value) {
        var Dimension, offset;
        offset = void 0;
        Dimension = dimension.replace(/./, function(m) {
          return m[0].toUpperCase();
        });
        if (value === undefined) {
          if (this[0] === window) {
            return window["inner" + Dimension];
          } else {
            if (this[0] === document) {
              return document.documentElement["offset" + Dimension];
            } else {
              return (offset = this.offset()) && offset[dimension];
            }
          }
        } else {
          return this.each(function(idx) {
            var el;
            el = $(this);
            return el.css(dimension, funcArg(this, value, idx, el[dimension]()));
          });
        }
      };
    });
    adjacencyOperators.forEach(function(key, operator) {
      var reverseKey;
      $.fn[key] = function(html) {
        var copyByClone, inReverse, nodes, size;
        nodes = (isO(html) ? html : fragment(html));
        if ((!("length" in nodes)) || nodes.nodeType) nodes = [nodes];
        if (nodes.length < 1) return this;
        size = this.length;
        copyByClone = size > 1;
        inReverse = operator < 2;
        return this.each(function(index, target) {
          var i, node, _results;
          i = 0;
          _results = [];
          while (i < nodes.length) {
            node = nodes[(inReverse ? nodes.length - i - 1 : i)];
            traverseNode(node, function(node) {
              if ((node.nodeName != null) && node.nodeName.toUpperCase() === "SCRIPT" && (!node.type || node.type === "text/javascript")) {
                return window["eval"].call(window, node.innerHTML);
              }
            });
            if (copyByClone && index < size - 1) node = node.cloneNode(true);
            insert(operator, target, node);
            _results.push(i++);
          }
          return _results;
        });
      };
      reverseKey = (operator % 2 ? key + "To" : "insert" + (operator ? "Before" : "After"));
      return $.fn[reverseKey] = function(html) {
        $(html)[key](this);
        return this;
      };
    });
    Z.prototype = $.fn;
    return $;
  })();

  window.Zepto = Zepto;

  "$" in window || (window.$ = Zepto);

  (function($) {
    var $$, add, createProxy, eachEvent, eventMethods, findHandlers, fix, handlers, matcherFor, parse, remove, returnFalse, returnTrue, specialEvents, zid, _zid;
    zid = function(element) {
      return element._zid || (element._zid = _zid++);
    };
    findHandlers = function(element, event, fn, selector) {
      var matcher;
      event = parse(event);
      if (event.ns) matcher = matcherFor(event.ns);
      return (handlers[zid(element)] || []).filter(function(handler) {
        return handler && (!event.e || handler.e === event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn === fn) && (!selector || handler.sel === selector);
      });
    };
    parse = function(event) {
      var parts;
      parts = ("" + event).split(".");
      return {
        e: parts[0],
        ns: parts.slice(1).sort().join(" ")
      };
    };
    matcherFor = function(ns) {
      return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
    };
    eachEvent = function(events, fn, iterator) {
      if ($.isObject(events)) {
        return $.each(events, iterator);
      } else {
        return events.split(/\s/).forEach(function(type) {
          return iterator(type, fn);
        });
      }
    };
    add = function(element, events, fn, selector, getDelegate) {
      var id, set;
      id = zid(element);
      set = handlers[id] || (handlers[id] = []);
      return eachEvent(events, fn, function(event, fn) {
        var callback, delegate, handler, proxyfn;
        delegate = getDelegate && getDelegate(fn, event);
        callback = delegate || fn;
        proxyfn = function(event) {
          var result;
          result = callback.apply(element, [event].concat(event.data));
          if (result === false) event.preventDefault();
          return result;
        };
        handler = $.extend(parse(event), {
          fn: fn,
          proxy: proxyfn,
          sel: selector,
          del: delegate,
          i: set.length
        });
        set.push(handler);
        return element.addEventListener(handler.e, proxyfn, false);
      });
    };
    remove = function(element, events, fn, selector) {
      var id;
      id = zid(element);
      return eachEvent(events || "", fn, function(event, fn) {
        return findHandlers(element, event, fn, selector).forEach(function(handler) {
          delete handlers[id][handler.i];
          return element.removeEventListener(handler.e, handler.proxy, false);
        });
      });
    };
    createProxy = function(event) {
      var proxy;
      proxy = $.extend({
        originalEvent: event
      }, event);
      $.each(eventMethods, function(name, predicate) {
        proxy[name] = function() {
          this[predicate] = returnTrue;
          return event[name].apply(event, arguments);
        };
        return proxy[predicate] = returnFalse;
      });
      return proxy;
    };
    fix = function(event) {
      var prevent;
      if (!("defaultPrevented" in event)) {
        event.defaultPrevented = false;
        prevent = event.preventDefault;
        return event.preventDefault = function() {
          this.defaultPrevented = true;
          return prevent.call(this);
        };
      }
    };
    $$ = $.qsa;
    handlers = {};
    _zid = 1;
    specialEvents = {};
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
    $.event = {
      add: add,
      remove: remove
    };
    $.fn.bind = function(event, callback) {
      return this.each(function() {
        return add(this, event, callback);
      });
    };
    $.fn.unbind = function(event, callback) {
      return this.each(function() {
        return remove(this, event, callback);
      });
    };
    $.fn.one = function(event, callback) {
      return this.each(function(i, element) {
        return add(this, event, callback, null, function(fn, type) {
          return function() {
            var result;
            result = fn.apply(element, arguments);
            remove(element, type, fn);
            return result;
          };
        });
      });
    };
    returnTrue = function() {
      return true;
    };
    returnFalse = function() {
      return false;
    };
    eventMethods = {
      preventDefault: "isDefaultPrevented",
      stopImmediatePropagation: "isImmediatePropagationStopped",
      stopPropagation: "isPropagationStopped"
    };
    $.fn.delegate = function(selector, event, callback) {
      return this.each(function(i, element) {
        return add(element, event, callback, selector, function(fn) {
          return function(e) {
            var evt, match;
            evt = void 0;
            match = $(e.target).closest(selector, element).get(0);
            if (match) {
              evt = $.extend(createProxy(e), {
                currentTarget: match,
                liveFired: element
              });
              return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
            }
          };
        });
      });
    };
    $.fn.undelegate = function(selector, event, callback) {
      return this.each(function() {
        return remove(this, event, callback, selector);
      });
    };
    $.fn.live = function(event, callback) {
      $(document.body).delegate(this.selector, event, callback);
      return this;
    };
    $.fn.die = function(event, callback) {
      $(document.body).undelegate(this.selector, event, callback);
      return this;
    };
    $.fn.on = function(event, selector, callback) {
      if (selector === undefined || $.isFunction(selector)) {
        return this.bind(event, selector);
      } else {
        return this.delegate(selector, event, callback);
      }
    };
    $.fn.off = function(event, selector, callback) {
      if (selector === undefined || $.isFunction(selector)) {
        return this.unbind(event, selector);
      } else {
        return this.undelegate(selector, event, callback);
      }
    };
    $.fn.trigger = function(event, data) {
      if (typeof event === "string") event = $.Event(event);
      fix(event);
      event.data = data;
      return this.each(function() {
        return this.dispatchEvent(event);
      });
    };
    $.fn.triggerHandler = function(event, data) {
      var e, result;
      e = void 0;
      result = void 0;
      this.each(function(i, element) {
        e = createProxy((typeof event === "string" ? $.Event(event) : event));
        e.data = data;
        e.target = element;
        return $.each(findHandlers(element, event.type || event), function(i, handler) {
          result = handler.proxy(e);
          if (e.isImmediatePropagationStopped()) return false;
        });
      });
      return result;
    };
    ("focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
      return $.fn[event] = function(callback) {
        return this.bind(event, callback);
      };
    });
    ["focus", "blur"].forEach(function(name) {
      return $.fn[name] = function(callback) {
        if (callback) {
          this.bind(name, callback);
        } else if (this.length) {
          try {
            this.get(0)[name]();
          } catch (_error) {}
        }
        return this;
      };
    });
    return $.Event = function(type, props) {
      var bubbles, event, name;
      event = document.createEvent(specialEvents[type] || "Events");
      bubbles = true;
      if (props) {
        for (name in props) {
          if (name === "bubbles") {
            bubbles = !!props[name];
          } else {
            event[name] = props[name];
          }
        }
      }
      event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
      return event;
    };
  })(Zepto);

  (function($) {
    var detect;
    detect = function(ua) {
      var android, blackberry, browser, ipad, iphone, os, touchpad, webkit, webos;
      os = (this.os = {});
      browser = (this.browser = {});
      webkit = ua.match(/WebKit\/([\d.]+)/);
      android = ua.match(/(Android)\s+([\d.]+)/);
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
      touchpad = webos && ua.match(/TouchPad/);
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
      if (webkit) browser.version = webkit[1];
      browser.webkit = !!webkit;
      if (android) {
        os.android = true;
        os.version = android[2];
      }
      if (iphone) {
        os.ios = true;
        os.version = iphone[2].replace(/_/g, ".");
        os.iphone = true;
      }
      if (ipad) {
        os.ios = true;
        os.version = ipad[2].replace(/_/g, ".");
        os.ipad = true;
      }
      if (webos) {
        os.webos = true;
        os.version = webos[2];
      }
      if (touchpad) os.touchpad = true;
      if (blackberry) {
        os.blackberry = true;
        return os.version = blackberry[2];
      }
    };
    detect.call($, navigator.userAgent);
    return $.__detect = detect;
  })(Zepto);

  (function($, undefined_) {
    var document, downcase, endAnimationName, endEventName, eventPrefix, normalizeEvent, prefix, supportedTransforms, testEl, vendors;
    downcase = function(str) {
      return str.toLowerCase();
    };
    normalizeEvent = function(name) {
      if (eventPrefix) {
        return eventPrefix + name;
      } else {
        return downcase(name);
      }
    };
    prefix = "";
    eventPrefix = void 0;
    endEventName = void 0;
    endAnimationName = void 0;
    vendors = {
      Webkit: "webkit",
      Moz: "",
      O: "o",
      ms: "MS"
    };
    document = window.document;
    testEl = document.createElement("div");
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
    $.each(vendors, function(vendor, event) {
      if (testEl.style[vendor + "TransitionProperty"] !== undefined) {
        prefix = "-" + downcase(vendor) + "-";
        eventPrefix = event;
        return false;
      }
    });
    $.fx = {
      off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
      cssPrefix: prefix,
      transitionEnd: normalizeEvent("TransitionEnd"),
      animationEnd: normalizeEvent("AnimationEnd")
    };
    $.fn.animate = function(properties, duration, ease, callback) {
      if ($.isObject(duration)) {
        ease = duration.easing;
        callback = duration.complete;
        duration = duration.duration;
      }
      if (duration) duration = duration / 1000;
      return this.anim(properties, duration, ease, callback);
    };
    $.fn.anim = function(properties, duration, ease, callback) {
      var cssProperties, endEvent, key, that, transforms, wrappedCallback;
      transforms = void 0;
      cssProperties = {};
      key = void 0;
      that = this;
      wrappedCallback = void 0;
      endEvent = $.fx.transitionEnd;
      if (duration === undefined) duration = 0.4;
      if ($.fx.off) duration = 0;
      if (typeof properties === "string") {
        cssProperties[prefix + "animation-name"] = properties;
        cssProperties[prefix + "animation-duration"] = duration + "s";
        endEvent = $.fx.animationEnd;
      } else {
        for (key in properties) {
          if (supportedTransforms.test(key)) {
            transforms || (transforms = []);
            transforms.push(key + "(" + properties[key] + ")");
          } else {
            cssProperties[key] = properties[key];
          }
        }
        if (transforms) cssProperties[prefix + "transform"] = transforms.join(" ");
        if (!$.fx.off) {
          cssProperties[prefix + "transition"] = "all " + duration + "s " + (ease || "");
        }
      }
      wrappedCallback = function() {
        var props;
        props = {};
        props[prefix + "transition"] = props[prefix + "animation-name"] = "none";
        $(this).css(props);
        return callback && callback.call(this);
      };
      if (duration > 0) this.one(endEvent, wrappedCallback);
      setTimeout((function() {
        that.css(cssProperties);
        if (duration <= 0) {
          return setTimeout((function() {
            return that.each(function() {
              return wrappedCallback.call(this);
            });
          }), 0);
        }
      }), 0);
      return this;
    };
    return testEl = null;
  })(Zepto);

  (function($) {
    var ajaxBeforeSend, ajaxComplete, ajaxError, ajaxStart, ajaxStop, ajaxSuccess, document, empty, escape, isObject, jsonpID, key, name, serialize, triggerAndReturn, triggerGlobal;
    triggerAndReturn = function(context, eventName, data) {
      var event;
      event = $.Event(eventName);
      $(context).trigger(event, data);
      return !event.defaultPrevented;
    };
    triggerGlobal = function(settings, context, eventName, data) {
      if (settings.global) {
        return triggerAndReturn(context || document, eventName, data);
      }
    };
    ajaxStart = function(settings) {
      if (settings.global && $.active++ === 0) {
        return triggerGlobal(settings, null, "ajaxStart");
      }
    };
    ajaxStop = function(settings) {
      if (settings.global && !(--$.active)) {
        return triggerGlobal(settings, null, "ajaxStop");
      }
    };
    ajaxBeforeSend = function(xhr, settings) {
      var context;
      context = settings.context;
      if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === false) {
        return false;
      }
      return triggerGlobal(settings, context, "ajaxSend", [xhr, settings]);
    };
    ajaxSuccess = function(data, xhr, settings) {
      var context, status;
      context = settings.context;
      status = "success";
      settings.success.call(context, data, status, xhr);
      triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]);
      return ajaxComplete(status, xhr, settings);
    };
    ajaxError = function(error, type, xhr, settings) {
      var context;
      context = settings.context;
      settings.error.call(context, xhr, type, error);
      triggerGlobal(settings, context, "ajaxError", [xhr, settings, error]);
      return ajaxComplete(type, xhr, settings);
    };
    ajaxComplete = function(status, xhr, settings) {
      var context;
      context = settings.context;
      settings.complete.call(context, xhr, status);
      triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]);
      return ajaxStop(settings);
    };
    empty = function() {};
    serialize = function(params, obj, traditional, scope) {
      var array;
      array = $.isArray(obj);
      return $.each(obj, function(key, value) {
        if (scope) {
          key = (traditional ? scope : scope + "[" + (array ? "" : key) + "]");
        }
        if (!scope && array) {
          return params.add(value.name, value.value);
        } else if ((traditional ? $.isArray(value) : isObject(value))) {
          return serialize(params, value, traditional, key);
        } else {
          return params.add(key, value);
        }
      });
    };
    jsonpID = 0;
    isObject = $.isObject;
    document = window.document;
    key = void 0;
    name = void 0;
    $.active = 0;
    $.ajaxJSONP = function(options) {
      var abort, abortTimeout, callbackName, script, xhr;
      callbackName = "jsonp" + (++jsonpID);
      script = document.createElement("script");
      abort = function() {
        $(script).remove();
        if (callbackName in window) window[callbackName] = empty;
        return ajaxComplete(xhr, options, "abort");
      };
      xhr = {
        abort: abort
      };
      abortTimeout = void 0;
      window[callbackName] = function(data) {
        clearTimeout(abortTimeout);
        $(script).remove();
        delete window[callbackName];
        return ajaxSuccess(data, xhr, options);
      };
      script.src = options.url.replace(RegExp("=\\?"), "=" + callbackName);
      $("head").append(script);
      if (options.timeout > 0) {
        abortTimeout = setTimeout(function() {
          xhr.abort();
          return ajaxComplete(xhr, options, "timeout");
        }, options.timeout);
      }
      return xhr;
    };
    $.ajaxSettings = {
      type: "GET",
      beforeSend: empty,
      success: empty,
      error: empty,
      complete: empty,
      context: null,
      global: true,
      xhr: function() {
        return new window.XMLHttpRequest();
      },
      accepts: {
        script: "text/javascript, application/javascript",
        json: "application/json",
        xml: "application/xml, text/xml",
        html: "text/html",
        text: "text/plain"
      },
      crossDomain: false,
      timeout: 0
    };
    $.ajax = function(options) {
      var abortTimeout, baseHeaders, key, mime, name, protocol, queryString, settings, xhr;
      settings = $.extend({}, options || {});
      for (key in $.ajaxSettings) {
        if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
      }
      ajaxStart(settings);
      if (!settings.crossDomain) {
        settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
      }
      if (RegExp("=\\?").test(settings.url)) return $.ajaxJSONP(settings);
      if (!settings.url) settings.url = window.location.toString();
      if (settings.data && !settings.contentType) {
        settings.contentType = "application/x-www-form-urlencoded";
      }
      if (isObject(settings.data)) settings.data = $.param(settings.data);
      if (settings.type.match(/get/i) && settings.data) {
        queryString = settings.data;
        if (settings.url.match(/\?.*=/)) {
          queryString = "&" + queryString;
        } else {
          if (queryString[0] !== "?") queryString = "?" + queryString;
        }
        settings.url += queryString;
      }
      mime = settings.accepts[settings.dataType];
      baseHeaders = {};
      protocol = (/^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol);
      xhr = $.ajaxSettings.xhr();
      abortTimeout = void 0;
      if (!settings.crossDomain) {
        baseHeaders["X-Requested-With"] = "XMLHttpRequest";
      }
      if (mime) baseHeaders["Accept"] = mime;
      settings.headers = $.extend(baseHeaders, settings.headers || {});
      xhr.onreadystatechange = function() {
        var error, result;
        if (xhr.readyState === 4) {
          clearTimeout(abortTimeout);
          result = void 0;
          error = false;
          if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && protocol === "file:")) {
            if (mime === "application/json" && !(/^\s*$/.test(xhr.responseText))) {
              try {
                result = JSON.parse(xhr.responseText);
              } catch (e) {
                error = e;
              }
            } else {
              result = xhr.responseText;
            }
            if (error) {
              return ajaxError(error, "parsererror", xhr, settings);
            } else {
              return ajaxSuccess(result, xhr, settings);
            }
          } else {
            return ajaxError(null, "error", xhr, settings);
          }
        }
      };
      xhr.open(settings.type, settings.url, true);
      if (settings.contentType) {
        settings.headers["Content-Type"] = settings.contentType;
      }
      for (name in settings.headers) {
        xhr.setRequestHeader(name, settings.headers[name]);
      }
      if (ajaxBeforeSend(xhr, settings) === false) {
        xhr.abort();
        return false;
      }
      if (settings.timeout > 0) {
        abortTimeout = setTimeout(function() {
          xhr.onreadystatechange = empty;
          xhr.abort();
          return ajaxError(null, "timeout", xhr, settings);
        }, settings.timeout);
      }
      xhr.send(settings.data);
      return xhr;
    };
    $.get = function(url, success) {
      return $.ajax({
        url: url,
        success: success
      });
    };
    $.post = function(url, data, success, dataType) {
      if ($.isFunction(data)) {
        dataType = dataType || success;
        success = data;
        data = null;
      }
      return $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        dataType: dataType
      });
    };
    $.getJSON = function(url, success) {
      return $.ajax({
        url: url,
        success: success,
        dataType: "json"
      });
    };
    $.fn.load = function(url, success) {
      var parts, selector, self;
      if (!this.length) return this;
      self = this;
      parts = url.split(/\s/);
      selector = void 0;
      if (parts.length > 1) {
        url = parts[0];
        selector = parts[1];
      }
      $.get(url, function(response) {
        self.html((selector ? $(document.createElement("div")).html(response).find(selector).html() : response));
        return success && success.call(self);
      });
      return this;
    };
    escape = encodeURIComponent;
    return $.param = function(obj, traditional) {
      var params;
      params = [];
      params.add = function(k, v) {
        return this.push(escape(k) + "=" + escape(v));
      };
      serialize(params, obj, traditional);
      return params.join("&").replace("%20", "+");
    };
  })(Zepto);

  (function($) {
    $.fn.serializeArray = function() {
      var el, result;
      result = [];
      el = void 0;
      $(Array.prototype.slice.call(this.get(0).elements)).each(function() {
        var type;
        el = $(this);
        type = el.attr("type");
        if (!this.disabled && type !== "submit" && type !== "reset" && type !== "button" && ((type !== "radio" && type !== "checkbox") || this.checked)) {
          return result.push({
            name: el.attr("name"),
            value: el.val()
          });
        }
      });
      return result;
    };
    $.fn.serialize = function() {
      var result;
      result = [];
      this.serializeArray().forEach(function(elm) {
        return result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value));
      });
      return result.join("&");
    };
    return $.fn.submit = function(callback) {
      var event;
      if (callback) {
        this.bind("submit", callback);
      } else if (this.length) {
        event = $.Event("submit");
        this.eq(0).trigger(event);
        if (!event.defaultPrevented) this.get(0).submit();
      }
      return this;
    };
  })(Zepto);

  (function($) {
    var longTap, longTapDelay, parentIfText, swipeDirection, touch, touchTimeout;
    parentIfText = function(node) {
      if ("tagName" in node) {
        return node;
      } else {
        return node.parentNode;
      }
    };
    swipeDirection = function(x1, x2, y1, y2) {
      var xDelta, yDelta;
      xDelta = Math.abs(x1 - x2);
      yDelta = Math.abs(y1 - y2);
      if (xDelta >= yDelta) {
        if (x1 - x2 > 0) {
          return "Left";
        } else {
          return "Right";
        }
      } else {
        if (y1 - y2 > 0) {
          return "Up";
        } else {
          return "Down";
        }
      }
    };
    longTap = function() {
      var touch;
      if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
        $(touch.target).trigger("longTap");
        return touch = {};
      }
    };
    touch = {};
    touchTimeout = void 0;
    longTapDelay = 750;
    $(document).ready(function() {
      return $(document.body).bind("touchstart", function(e) {
        var delta, now;
        now = Date.now();
        delta = now - (touch.last || now);
        touch.target = parentIfText(e.touches[0].target);
        touchTimeout && clearTimeout(touchTimeout);
        touch.x1 = e.touches[0].pageX;
        touch.y1 = e.touches[0].pageY;
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
        touch.last = now;
        return setTimeout(longTap, longTapDelay);
      }).bind("touchmove", function(e) {
        touch.x2 = e.touches[0].pageX;
        return touch.y2 = e.touches[0].pageY;
      }).bind("touchend", function(e) {
        if (touch.isDoubleTap) {
          $(touch.target).trigger("doubleTap");
          return touch = {};
        } else if (touch.x2 > 0 || touch.y2 > 0) {
          (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) && $(touch.target).trigger("swipe") && $(touch.target).trigger("swipe" + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
          return touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
        } else if ("last" in touch) {
          return touchTimeout = setTimeout(function() {
            touchTimeout = null;
            $(touch.target).trigger("tap");
            return touch = {};
          }, 250);
        }
      }).bind("touchcancel", function() {
        return touch = {};
      });
    });
    return ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "longTap"].forEach(function(m) {
      return $.fn[m] = function(callback) {
        return this.bind(m, callback);
      };
    });
  })(Zepto);

  /*
  fill-all-the-things 0.0.1
  Fills out forms with dummy data
  site: https://github.com/searls/fill-all-the-things
  */

}).call(this);
