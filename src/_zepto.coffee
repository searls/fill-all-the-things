Zepto = (->
  isF = (value) ->
    ({}).toString.call(value) is "[object Function]"
  isO = (value) ->
    value instanceof Object
  isA = (value) ->
    value instanceof Array
  likeArray = (obj) ->
    typeof obj.length is "number"
  compact = (array) ->
    array.filter (item) ->
      item isnt `undefined` and item isnt null
  flatten = (array) ->
    (if array.length > 0 then [].concat.apply([], array) else array)
  camelize = (str) ->
    str.replace /-+(.)?/g, (match, chr) ->
      (if chr then chr.toUpperCase() else "")
  dasherize = (str) ->
    str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
  uniq = (array) ->
    array.filter (item, index, array) ->
      array.indexOf(item) is index
  classRE = (name) ->
    (if name of classCache then classCache[name] else (classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)")))
  maybeAddPx = (name, value) ->
    (if (typeof value is "number" and not cssNumber[dasherize(name)]) then value + "px" else value)
  defaultDisplay = (nodeName) ->
    element = undefined
    display = undefined
    unless elementDisplay[nodeName]
      element = document.createElement(nodeName)
      document.body.appendChild element
      display = getComputedStyle(element, "").getPropertyValue("display")
      element.parentNode.removeChild element
      display is "none" and (display = "block")
      elementDisplay[nodeName] = display
    elementDisplay[nodeName]
  fragment = (html, name) ->
    fragmentRE.test(html) and RegExp.$1  if name is `undefined`
    name = "*"  unless name of containers
    container = containers[name]
    container.innerHTML = "" + html
    slice.call container.childNodes
  Z = (dom, selector) ->
    dom = dom or emptyArray
    dom.__proto__ = Z::
    dom.selector = selector or ""
    dom
  $ = (selector, context) ->
    return Z()  unless selector
    if context isnt `undefined`
      $(context).find selector
    else if isF(selector)
      $(document).ready selector
    else unless selector instanceof Z
      dom = undefined
      if isA(selector)
        dom = compact(selector)
      else if elementTypes.indexOf(selector.nodeType) >= 0 or selector is window
        dom = [ selector ]
        selector = null
      else if fragmentRE.test(selector)
        dom = fragment(selector.trim(), RegExp.$1)
        selector = null
      else if selector.nodeType and selector.nodeType is 3
        dom = [ selector ]
      else
        dom = $$(document, selector)
      Z dom, selector
  filtered = (nodes, selector) ->
    (if selector is `undefined` then $(nodes) else $(nodes).filter(selector))
  funcArg = (context, arg, idx, payload) ->
    (if isF(arg) then arg.call(context, idx, payload) else arg)
  insert = (operator, target, node) ->
    parent = (if (operator % 2) then target else target.parentNode)
    parent and parent.insertBefore(node, (if not operator then target.nextSibling else (if operator is 1 then parent.firstChild else (if operator is 2 then target else null))))
  traverseNode = (node, fun) ->
    fun node
    for key of node.childNodes
      traverseNode node.childNodes[key], fun
  #undefined = undefined
  key = undefined
  $$ = undefined
  classList = undefined
  emptyArray = []
  slice = emptyArray.slice
  document = window.document
  elementDisplay = {}
  classCache = {}
  getComputedStyle = document.defaultView.getComputedStyle
  cssNumber =
    "column-count": 1
    columns: 1
    "font-weight": 1
    "line-height": 1
    opacity: 1
    "z-index": 1
    zoom: 1

  fragmentRE = /^\s*<(\w+)[^>]*>/
  elementTypes = [ 1, 9, 11 ]
  adjacencyOperators = [ "after", "prepend", "before", "append" ]
  table = document.createElement("table")
  tableRow = document.createElement("tr")
  containers =
    tr: document.createElement("tbody")
    tbody: table
    thead: table
    tfoot: table
    td: tableRow
    th: tableRow
    "*": document.createElement("div")

  readyRE = /complete|loaded|interactive/
  classSelectorRE = /^\.([\w-]+)$/
  idSelectorRE = /^#([\w-]+)$/
  tagSelectorRE = /^[\w-]+$/
  $.extend = (target) ->
    slice.call(arguments, 1).forEach (source) ->
      for key of source
        target[key] = source[key]

    target

  $.qsa = $$ = (element, selector) ->
    found = undefined
    (if (element is document and idSelectorRE.test(selector)) then (if (found = element.getElementById(RegExp.$1)) then [ found ] else emptyArray) else slice.call((if classSelectorRE.test(selector) then element.getElementsByClassName(RegExp.$1) else (if tagSelectorRE.test(selector) then element.getElementsByTagName(selector) else element.querySelectorAll(selector)))))

  $.isFunction = isF
  $.isObject = isO
  $.isArray = isA
  $.map = (elements, callback) ->
    value = undefined
    values = []
    i = undefined
    key = undefined
    if likeArray(elements)
      i = 0
      while i < elements.length
        value = callback(elements[i], i)
        values.push value  if value?
        i++
    else
      for key of elements
        value = callback(elements[key], key)
        values.push value  if value?
    flatten values

  $.each = (elements, callback) ->
    i = undefined
    key = undefined
    if likeArray(elements)
      i = 0
      while i < elements.length
        return elements  if callback(i, elements[i]) is false
        i++
    else
      for key of elements
        return elements  if callback(key, elements[key]) is false
    elements

  $.fn =
    forEach: emptyArray.forEach
    reduce: emptyArray.reduce
    push: emptyArray.push
    indexOf: emptyArray.indexOf
    concat: emptyArray.concat
    map: (fn) ->
      $.map this, (el, i) ->
        fn.call el, i, el

    slice: ->
      $ slice.apply(this, arguments)

    ready: (callback) ->
      if readyRE.test(document.readyState)
        callback $
      else
        document.addEventListener "DOMContentLoaded", (->
          callback $
        ), false
      this

    get: (idx) ->
      (if idx is `undefined` then this else this[idx])

    size: ->
      @length

    remove: ->
      @each ->
        @parentNode.removeChild this  if @parentNode?

    each: (callback) ->
      @forEach (el, idx) ->
        callback.call el, idx, el

      this

    filter: (selector) ->
      $ [].filter.call(this, (element) ->
        element.parentNode and $$(element.parentNode, selector).indexOf(element) >= 0
      )

    end: ->
      @prevObject or $()

    andSelf: ->
      @add @prevObject or $()

    add: (selector, context) ->
      $ uniq(@concat($(selector, context)))

    is: (selector) ->
      @length > 0 and $(this[0]).filter(selector).length > 0

    not: (selector) ->
      nodes = []
      unless isF(selector) and selector.call isnt `undefined`
        excludes = (if typeof selector is "string" then @filter(selector) else (if (likeArray(selector) and isF(selector.item)) then slice.call(selector) else $(selector)))
        @forEach (el) ->
          nodes.push el  if excludes.indexOf(el) < 0
      $ nodes

    eq: (idx) ->
      (if idx is -1 then @slice(idx) else @slice(idx, +idx + 1))

    first: ->
      el = this[0]
      (if el and not isO(el) then el else $(el))

    last: ->
      el = this[@length - 1]
      (if el and not isO(el) then el else $(el))

    find: (selector) ->
      result = undefined
      if @length is 1
        result = $$(this[0], selector)
      else
        result = @map(->
          $$ this, selector
        )
      $ result

    closest: (selector, context) ->
      node = this[0]
      candidates = $$(context or document, selector)
      node = null  unless candidates.length
      node = node isnt context and node isnt document and node.parentNode  while node and candidates.indexOf(node) < 0
      $ node

    parents: (selector) ->
      ancestors = []
      nodes = this
      while nodes.length > 0
        nodes = $.map(nodes, (node) ->
          if (node = node.parentNode) and node isnt document and ancestors.indexOf(node) < 0
            ancestors.push node
            node
        )
      filtered ancestors, selector

    parent: (selector) ->
      filtered uniq(@pluck("parentNode")), selector

    children: (selector) ->
      filtered @map(->
        slice.call @children
      ), selector

    siblings: (selector) ->
      filtered @map((i, el) ->
        slice.call(el.parentNode.children).filter (child) ->
          child isnt el
      ), selector

    empty: ->
      @each ->
        @innerHTML = ""

    pluck: (property) ->
      @map ->
        this[property]

    show: ->
      @each ->
        @style.display is "none" and (@style.display = null)
        @style.display = defaultDisplay(@nodeName)  if getComputedStyle(this, "").getPropertyValue("display") is "none"

    replaceWith: (newContent) ->
      @each ->
        $(this).before(newContent).remove()

    wrap: (newContent) ->
      @each ->
        $(this).wrapAll $(newContent)[0].cloneNode(false)

    wrapAll: (newContent) ->
      if this[0]
        $(this[0]).before newContent = $(newContent)
        newContent.append this
      this

    unwrap: ->
      @parent().each ->
        $(this).replaceWith $(this).children()

      this

    hide: ->
      @css "display", "none"

    toggle: (setting) ->
      (if (if setting is `undefined` then @css("display") is "none" else setting) then @show() else @hide())

    prev: ->
      $ @pluck("previousElementSibling")

    next: ->
      $ @pluck("nextElementSibling")

    html: (html) ->
      (if html is `undefined` then (if @length > 0 then this[0].innerHTML else null) else @each((idx) ->
        originHtml = @innerHTML
        $(this).empty().append funcArg(this, html, idx, originHtml)
      ))

    text: (text) ->
      (if text is `undefined` then (if @length > 0 then this[0].textContent else null) else @each(->
        @textContent = text
      ))

    attr: (name, value) ->
      res = undefined
      (if (typeof name is "string" and value is `undefined`) then (if @length is 0 then `undefined` else (if (name is "value" and this[0].nodeName is "INPUT") then @val() else (if (not (res = this[0].getAttribute(name)) and name of this[0]) then this[0][name] else res))) else @each((idx) ->
        if isO(name)
          for key of name
            @setAttribute key, name[key]
        else
          @setAttribute name, funcArg(this, value, idx, @getAttribute(name))
      ))

    removeAttr: (name) ->
      @each ->
        @removeAttribute name

    data: (name, value) ->
      @attr "data-" + name, value

    val: (value) ->
      (if (value is `undefined`) then (if @length > 0 then this[0].value else null) else @each((idx) ->
        @value = funcArg(this, value, idx, @value)
      ))

    offset: ->
      return null  if @length is 0
      obj = this[0].getBoundingClientRect()
      left: obj.left + window.pageXOffset
      top: obj.top + window.pageYOffset
      width: obj.width
      height: obj.height

    css: (property, value) ->
      return (if @length is 0 then `undefined` else this[0].style[camelize(property)] or getComputedStyle(this[0], "").getPropertyValue(property))  if value is `undefined` and typeof property is "string"
      css = ""
      for key of property
        css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";"
      css = dasherize(property) + ":" + maybeAddPx(property, value)  if typeof property is "string"
      @each ->
        @style.cssText += ";" + css

    index: (element) ->
      (if element then @indexOf($(element)[0]) else @parent().children().indexOf(this[0]))

    hasClass: (name) ->
      if @length < 1
        false
      else
        classRE(name).test this[0].className

    addClass: (name) ->
      @each (idx) ->
        classList = []
        cls = @className
        newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach ((klass) ->
          classList.push klass  unless $(this).hasClass(klass)
        ), this
        classList.length and (@className += (if cls then " " else "") + classList.join(" "))

    removeClass: (name) ->
      @each (idx) ->
        return @className = ""  if name is `undefined`
        classList = @className
        funcArg(this, name, idx, classList).split(/\s+/g).forEach (klass) ->
          classList = classList.replace(classRE(klass), " ")

        @className = classList.trim()

    toggleClass: (name, when_) ->
      @each (idx) ->
        newName = funcArg(this, name, idx, @className)
        (if (if when_ is `undefined` then not $(this).hasClass(newName) else when_) then $(this).addClass(newName) else $(this).removeClass(newName))

  "filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings".split(",").forEach (property) ->
    fn = $.fn[property]
    $.fn[property] = ->
      ret = fn.apply(this, arguments)
      ret.prevObject = this
      ret

  [ "width", "height" ].forEach (dimension) ->
    $.fn[dimension] = (value) ->
      offset = undefined
      Dimension = dimension.replace(/./, (m) ->
        m[0].toUpperCase()
      )
      if value is `undefined`
        (if this[0] is window then window["inner" + Dimension] else (if this[0] is document then document.documentElement["offset" + Dimension] else (offset = @offset()) and offset[dimension]))
      else
        @each (idx) ->
          el = $(this)
          el.css dimension, funcArg(this, value, idx, el[dimension]())

  adjacencyOperators.forEach (key, operator) ->
    $.fn[key] = (html) ->
      nodes = (if isO(html) then html else fragment(html))
      nodes = [ nodes ]  if ("length" not of nodes) or nodes.nodeType
      return this  if nodes.length < 1
      size = @length
      copyByClone = size > 1
      inReverse = operator < 2
      @each (index, target) ->
        i = 0

        while i < nodes.length
          node = nodes[(if inReverse then nodes.length - i - 1 else i)]
          traverseNode node, (node) ->
            window["eval"].call window, node.innerHTML  if node.nodeName? and node.nodeName.toUpperCase() is "SCRIPT" and (not node.type or node.type is "text/javascript")

          node = node.cloneNode(true)  if copyByClone and index < size - 1
          insert operator, target, node
          i++

    reverseKey = (if (operator % 2) then key + "To" else "insert" + (if operator then "Before" else "After"))
    $.fn[reverseKey] = (html) ->
      $(html)[key] this
      this

  Z:: = $.fn
  $
)()
window.Zepto = Zepto
"$" of window or (window.$ = Zepto)
(($) ->
  zid = (element) ->
    element._zid or (element._zid = _zid++)
  findHandlers = (element, event, fn, selector) ->
    event = parse(event)
    matcher = matcherFor(event.ns)  if event.ns
    (handlers[zid(element)] or []).filter (handler) ->
      handler and (not event.e or handler.e is event.e) and (not event.ns or matcher.test(handler.ns)) and (not fn or handler.fn is fn) and (not selector or handler.sel is selector)
  parse = (event) ->
    parts = ("" + event).split(".")
    e: parts[0]
    ns: parts.slice(1).sort().join(" ")
  matcherFor = (ns) ->
    new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)")
  eachEvent = (events, fn, iterator) ->
    if $.isObject(events)
      $.each events, iterator
    else
      events.split(/\s/).forEach (type) ->
        iterator type, fn
  add = (element, events, fn, selector, getDelegate) ->
    id = zid(element)
    set = (handlers[id] or (handlers[id] = []))
    eachEvent events, fn, (event, fn) ->
      delegate = getDelegate and getDelegate(fn, event)
      callback = delegate or fn
      proxyfn = (event) ->
        result = callback.apply(element, [ event ].concat(event.data))
        event.preventDefault()  if result is false
        result

      handler = $.extend(parse(event),
        fn: fn
        proxy: proxyfn
        sel: selector
        del: delegate
        i: set.length
      )
      set.push handler
      element.addEventListener handler.e, proxyfn, false
  remove = (element, events, fn, selector) ->
    id = zid(element)
    eachEvent events or "", fn, (event, fn) ->
      findHandlers(element, event, fn, selector).forEach (handler) ->
        delete handlers[id][handler.i]

        element.removeEventListener handler.e, handler.proxy, false
  createProxy = (event) ->
    proxy = $.extend(
      originalEvent: event
    , event)
    $.each eventMethods, (name, predicate) ->
      proxy[name] = ->
        this[predicate] = returnTrue
        event[name].apply event, arguments

      proxy[predicate] = returnFalse

    proxy
  fix = (event) ->
    unless "defaultPrevented" of event
      event.defaultPrevented = false
      prevent = event.preventDefault
      event.preventDefault = ->
        @defaultPrevented = true
        prevent.call this
  $$ = $.qsa
  handlers = {}
  _zid = 1
  specialEvents = {}
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents"
  $.event =
    add: add
    remove: remove

  $.fn.bind = (event, callback) ->
    @each ->
      add this, event, callback

  $.fn.unbind = (event, callback) ->
    @each ->
      remove this, event, callback

  $.fn.one = (event, callback) ->
    @each (i, element) ->
      add this, event, callback, null, (fn, type) ->
        ->
          result = fn.apply(element, arguments)
          remove element, type, fn
          result

  returnTrue = ->
    true

  returnFalse = ->
    false

  eventMethods =
    preventDefault: "isDefaultPrevented"
    stopImmediatePropagation: "isImmediatePropagationStopped"
    stopPropagation: "isPropagationStopped"

  $.fn.delegate = (selector, event, callback) ->
    @each (i, element) ->
      add element, event, callback, selector, (fn) ->
        (e) ->
          evt = undefined
          match = $(e.target).closest(selector, element).get(0)
          if match
            evt = $.extend(createProxy(e),
              currentTarget: match
              liveFired: element
            )
            fn.apply match, [ evt ].concat([].slice.call(arguments, 1))

  $.fn.undelegate = (selector, event, callback) ->
    @each ->
      remove this, event, callback, selector

  $.fn.live = (event, callback) ->
    $(document.body).delegate @selector, event, callback
    this

  $.fn.die = (event, callback) ->
    $(document.body).undelegate @selector, event, callback
    this

  $.fn.on = (event, selector, callback) ->
    (if selector is `undefined` or $.isFunction(selector) then @bind(event, selector) else @delegate(selector, event, callback))

  $.fn.off = (event, selector, callback) ->
    (if selector is `undefined` or $.isFunction(selector) then @unbind(event, selector) else @undelegate(selector, event, callback))

  $.fn.trigger = (event, data) ->
    event = $.Event(event)  if typeof event is "string"
    fix event
    event.data = data
    @each ->
      @dispatchEvent event

  $.fn.triggerHandler = (event, data) ->
    e = undefined
    result = undefined
    @each (i, element) ->
      e = createProxy((if typeof event is "string" then $.Event(event) else event))
      e.data = data
      e.target = element
      $.each findHandlers(element, event.type or event), (i, handler) ->
        result = handler.proxy(e)
        false  if e.isImmediatePropagationStopped()

    result

  ("focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout " + "change select keydown keypress keyup error").split(" ").forEach (event) ->
    $.fn[event] = (callback) ->
      @bind event, callback

  [ "focus", "blur" ].forEach (name) ->
    $.fn[name] = (callback) ->
      if callback
        @bind name, callback
      else if @length
        try
          @get(0)[name]()
      this

  $.Event = (type, props) ->
    event = document.createEvent(specialEvents[type] or "Events")
    bubbles = true
    if props
      for name of props
        (if (name is "bubbles") then (bubbles = !!props[name]) else (event[name] = props[name]))
    event.initEvent type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null
    event
) Zepto
(($) ->
  detect = (ua) ->
    os = (@os = {})
    browser = (@browser = {})
    webkit = ua.match(/WebKit\/([\d.]+)/)
    android = ua.match(/(Android)\s+([\d.]+)/)
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
    iphone = not ipad and ua.match(/(iPhone\sOS)\s([\d_]+)/)
    webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/)
    touchpad = webos and ua.match(/TouchPad/)
    blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)
    browser.version = webkit[1]  if webkit
    browser.webkit = !!webkit
    if android
      os.android = true
      os.version = android[2]
    if iphone
      os.ios = true
      os.version = iphone[2].replace(/_/g, ".")
      os.iphone = true
    if ipad
      os.ios = true
      os.version = ipad[2].replace(/_/g, ".")
      os.ipad = true
    if webos
      os.webos = true
      os.version = webos[2]
    os.touchpad = true  if touchpad
    if blackberry
      os.blackberry = true
      os.version = blackberry[2]
  detect.call $, navigator.userAgent
  $.__detect = detect
) Zepto
(($, undefined_) ->
  downcase = (str) ->
    str.toLowerCase()
  normalizeEvent = (name) ->
    (if eventPrefix then eventPrefix + name else downcase(name))
  prefix = ""
  eventPrefix = undefined
  endEventName = undefined
  endAnimationName = undefined
  vendors =
    Webkit: "webkit"
    Moz: ""
    O: "o"
    ms: "MS"

  document = window.document
  testEl = document.createElement("div")
  supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i
  $.each vendors, (vendor, event) ->
    if testEl.style[vendor + "TransitionProperty"] isnt `undefined`
      prefix = "-" + downcase(vendor) + "-"
      eventPrefix = event
      false

  $.fx =
    off: (eventPrefix is `undefined` and testEl.style.transitionProperty is `undefined`)
    cssPrefix: prefix
    transitionEnd: normalizeEvent("TransitionEnd")
    animationEnd: normalizeEvent("AnimationEnd")

  $.fn.animate = (properties, duration, ease, callback) ->
    if $.isObject(duration)
      ease = duration.easing
      callback = duration.complete
      duration = duration.duration
    duration = duration / 1000  if duration
    @anim properties, duration, ease, callback

  $.fn.anim = (properties, duration, ease, callback) ->
    transforms = undefined
    cssProperties = {}
    key = undefined
    that = this
    wrappedCallback = undefined
    endEvent = $.fx.transitionEnd
    duration = 0.4  if duration is `undefined`
    duration = 0  if $.fx.off
    if typeof properties is "string"
      cssProperties[prefix + "animation-name"] = properties
      cssProperties[prefix + "animation-duration"] = duration + "s"
      endEvent = $.fx.animationEnd
    else
      for key of properties
        if supportedTransforms.test(key)
          transforms or (transforms = [])
          transforms.push key + "(" + properties[key] + ")"
        else
          cssProperties[key] = properties[key]
      cssProperties[prefix + "transform"] = transforms.join(" ")  if transforms
      cssProperties[prefix + "transition"] = "all " + duration + "s " + (ease or "")  unless $.fx.off
    wrappedCallback = ->
      props = {}
      props[prefix + "transition"] = props[prefix + "animation-name"] = "none"
      $(this).css props
      callback and callback.call(this)

    @one endEvent, wrappedCallback  if duration > 0
    setTimeout (->
      that.css cssProperties
      if duration <= 0
        setTimeout (->
          that.each ->
            wrappedCallback.call this
        ), 0
    ), 0
    this

  testEl = null
) Zepto
(($) ->
  triggerAndReturn = (context, eventName, data) ->
    event = $.Event(eventName)
    $(context).trigger event, data
    not event.defaultPrevented
  triggerGlobal = (settings, context, eventName, data) ->
    triggerAndReturn context or document, eventName, data  if settings.global
  ajaxStart = (settings) ->
    triggerGlobal settings, null, "ajaxStart"  if settings.global and $.active++ is 0
  ajaxStop = (settings) ->
    triggerGlobal settings, null, "ajaxStop"  if settings.global and not (--$.active)
  ajaxBeforeSend = (xhr, settings) ->
    context = settings.context
    return false  if settings.beforeSend.call(context, xhr, settings) is false or triggerGlobal(settings, context, "ajaxBeforeSend", [ xhr, settings ]) is false
    triggerGlobal settings, context, "ajaxSend", [ xhr, settings ]
  ajaxSuccess = (data, xhr, settings) ->
    context = settings.context
    status = "success"
    settings.success.call context, data, status, xhr
    triggerGlobal settings, context, "ajaxSuccess", [ xhr, settings, data ]
    ajaxComplete status, xhr, settings
  ajaxError = (error, type, xhr, settings) ->
    context = settings.context
    settings.error.call context, xhr, type, error
    triggerGlobal settings, context, "ajaxError", [ xhr, settings, error ]
    ajaxComplete type, xhr, settings
  ajaxComplete = (status, xhr, settings) ->
    context = settings.context
    settings.complete.call context, xhr, status
    triggerGlobal settings, context, "ajaxComplete", [ xhr, settings ]
    ajaxStop settings
  empty = ->
  serialize = (params, obj, traditional, scope) ->
    array = $.isArray(obj)
    $.each obj, (key, value) ->
      key = (if traditional then scope else scope + "[" + (if array then "" else key) + "]")  if scope
      if not scope and array
        params.add value.name, value.value
      else if (if traditional then $.isArray(value) else isObject(value))
        serialize params, value, traditional, key
      else
        params.add key, value
  jsonpID = 0
  isObject = $.isObject
  document = window.document
  key = undefined
  name = undefined
  $.active = 0
  $.ajaxJSONP = (options) ->
    callbackName = "jsonp" + (++jsonpID)
    script = document.createElement("script")
    abort = ->
      $(script).remove()
      window[callbackName] = empty  if callbackName of window
      ajaxComplete xhr, options, "abort"

    xhr = abort: abort
    abortTimeout = undefined
    window[callbackName] = (data) ->
      clearTimeout abortTimeout
      $(script).remove()
      delete window[callbackName]

      ajaxSuccess data, xhr, options

    script.src = options.url.replace(RegExp("=\\?"), "=" + callbackName)
    $("head").append script
    if options.timeout > 0
      abortTimeout = setTimeout(->
        xhr.abort()
        ajaxComplete xhr, options, "timeout"
      , options.timeout)
    xhr

  $.ajaxSettings =
    type: "GET"
    beforeSend: empty
    success: empty
    error: empty
    complete: empty
    context: null
    global: true
    xhr: ->
      new window.XMLHttpRequest()

    accepts:
      script: "text/javascript, application/javascript"
      json: "application/json"
      xml: "application/xml, text/xml"
      html: "text/html"
      text: "text/plain"

    crossDomain: false
    timeout: 0

  $.ajax = (options) ->
    settings = $.extend({}, options or {})
    for key of $.ajaxSettings
      settings[key] = $.ajaxSettings[key]  if settings[key] is `undefined`
    ajaxStart settings
    settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) and RegExp.$2 isnt window.location.host  unless settings.crossDomain
    return $.ajaxJSONP(settings)  if RegExp("=\\?").test(settings.url)
    settings.url = window.location.toString()  unless settings.url
    settings.contentType = "application/x-www-form-urlencoded"  if settings.data and not settings.contentType
    settings.data = $.param(settings.data)  if isObject(settings.data)
    if settings.type.match(/get/i) and settings.data
      queryString = settings.data
      if settings.url.match(/\?.*=/)
        queryString = "&" + queryString
      else queryString = "?" + queryString  unless queryString[0] is "?"
      settings.url += queryString
    mime = settings.accepts[settings.dataType]
    baseHeaders = {}
    protocol = (if /^([\w-]+:)\/\//.test(settings.url) then RegExp.$1 else window.location.protocol)
    xhr = $.ajaxSettings.xhr()
    abortTimeout = undefined
    baseHeaders["X-Requested-With"] = "XMLHttpRequest"  unless settings.crossDomain
    baseHeaders["Accept"] = mime  if mime
    settings.headers = $.extend(baseHeaders, settings.headers or {})
    xhr.onreadystatechange = ->
      if xhr.readyState is 4
        clearTimeout abortTimeout
        result = undefined
        error = false
        if (xhr.status >= 200 and xhr.status < 300) or (xhr.status is 0 and protocol is "file:")
          if mime is "application/json" and not (/^\s*$/.test(xhr.responseText))
            try
              result = JSON.parse(xhr.responseText)
            catch e
              error = e
          else
            result = xhr.responseText
          if error
            ajaxError error, "parsererror", xhr, settings
          else
            ajaxSuccess result, xhr, settings
        else
          ajaxError null, "error", xhr, settings

    xhr.open settings.type, settings.url, true
    settings.headers["Content-Type"] = settings.contentType  if settings.contentType
    for name of settings.headers
      xhr.setRequestHeader name, settings.headers[name]
    if ajaxBeforeSend(xhr, settings) is false
      xhr.abort()
      return false
    if settings.timeout > 0
      abortTimeout = setTimeout(->
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError null, "timeout", xhr, settings
      , settings.timeout)
    xhr.send settings.data
    xhr

  $.get = (url, success) ->
    $.ajax
      url: url
      success: success

  $.post = (url, data, success, dataType) ->
    if $.isFunction(data)
      dataType = dataType or success
      success = data
      data = null
    $.ajax
      type: "POST"
      url: url
      data: data
      success: success
      dataType: dataType

  $.getJSON = (url, success) ->
    $.ajax
      url: url
      success: success
      dataType: "json"

  $.fn.load = (url, success) ->
    return this  unless @length
    self = this
    parts = url.split(/\s/)
    selector = undefined
    if parts.length > 1
      url = parts[0]
      selector = parts[1]
    $.get url, (response) ->
      self.html (if selector then $(document.createElement("div")).html(response).find(selector).html() else response)
      success and success.call(self)

    this

  escape = encodeURIComponent
  $.param = (obj, traditional) ->
    params = []
    params.add = (k, v) ->
      @push escape(k) + "=" + escape(v)

    serialize params, obj, traditional
    params.join("&").replace "%20", "+"
) Zepto
(($) ->
  $.fn.serializeArray = ->
    result = []
    el = undefined
    $(Array::slice.call(@get(0).elements)).each ->
      el = $(this)
      type = el.attr("type")
      if not @disabled and type isnt "submit" and type isnt "reset" and type isnt "button" and ((type isnt "radio" and type isnt "checkbox") or @checked)
        result.push
          name: el.attr("name")
          value: el.val()

    result

  $.fn.serialize = ->
    result = []
    @serializeArray().forEach (elm) ->
      result.push encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value)

    result.join "&"

  $.fn.submit = (callback) ->
    if callback
      @bind "submit", callback
    else if @length
      event = $.Event("submit")
      @eq(0).trigger event
      @get(0).submit()  unless event.defaultPrevented
    this
) Zepto
(($) ->
  parentIfText = (node) ->
    (if "tagName" of node then node else node.parentNode)
  swipeDirection = (x1, x2, y1, y2) ->
    xDelta = Math.abs(x1 - x2)
    yDelta = Math.abs(y1 - y2)
    if xDelta >= yDelta
      (if x1 - x2 > 0 then "Left" else "Right")
    else
      (if y1 - y2 > 0 then "Up" else "Down")
  longTap = ->
    if touch.last and (Date.now() - touch.last >= longTapDelay)
      $(touch.target).trigger "longTap"
      touch = {}
  touch = {}
  touchTimeout = undefined
  longTapDelay = 750
  $(document).ready ->
    $(document.body).bind("touchstart", (e) ->
      now = Date.now()
      delta = now - (touch.last or now)
      touch.target = parentIfText(e.touches[0].target)
      touchTimeout and clearTimeout(touchTimeout)
      touch.x1 = e.touches[0].pageX
      touch.y1 = e.touches[0].pageY
      touch.isDoubleTap = true  if delta > 0 and delta <= 250
      touch.last = now
      setTimeout longTap, longTapDelay
    ).bind("touchmove", (e) ->
      touch.x2 = e.touches[0].pageX
      touch.y2 = e.touches[0].pageY
    ).bind("touchend", (e) ->
      if touch.isDoubleTap
        $(touch.target).trigger "doubleTap"
        touch = {}
      else if touch.x2 > 0 or touch.y2 > 0
        (Math.abs(touch.x1 - touch.x2) > 30 or Math.abs(touch.y1 - touch.y2) > 30) and $(touch.target).trigger("swipe") and $(touch.target).trigger("swipe" + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
        touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0
      else if "last" of touch
        touchTimeout = setTimeout(->
          touchTimeout = null
          $(touch.target).trigger "tap"
          touch = {}
        , 250)
    ).bind "touchcancel", ->
      touch = {}

  [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "longTap" ].forEach (m) ->
    $.fn[m] = (callback) ->
      @bind m, callback
) Zepto