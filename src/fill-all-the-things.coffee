###
fill-all-the-things @@VERSION@@
Fills out forms with dummy data
site: https://searls.github.com/fill-all-the-things

@depend ../vendor/jquery-no-conflict.js
@depend ../vendor/underscore-no-conflict.js

###
f = window.FillAllTheThings ||= {}

( ($,_) ->

  types = [
      test: (it) -> it.is(':checkbox,:radio')
      action: (it) -> it.attr('checked','checked')
    ,
      test: (it) -> it.is('select')
      action: (it) -> it.find('option[value="1975"],option:last').val()
    ,
      test: -> true
      action: (it, val) -> figureOutAValue(it, val)
  ]

  textFills = [
      test: (it) -> it.is(':password')
      action: -> "f1llTh!NG$?"
    ,
      test: (it) -> it.is('[type="email"]') or /email/i.test(it.attr('name'))
      action: -> "fill@llthethings.org"
    ,
      test: (it) -> it.is('[type="tel"]')
      action: -> "123-456-7890"
    ,
      test: (it) -> it.is('[type="url"]')
      action: -> "http://www.w3.org"
    ,
      test: (it, val) -> !val
      action: -> "Filling a Thing"
    ,
      test: -> true
      action: (it, val) -> val
  ]

  mutations = [
      test: (it) -> it.attr('maxlength')
      action: (it, val) -> val.substring(0, it.attr('maxlength'))
    ,
  ]

  f.fill = ->
    $inputs = $(':input:visible:enabled').val (i, val) ->
      doFirst(types, [$(@), val])

  figureOutAValue = (it, val) ->
    val = doFirst(textFills, [it,val])
    doAll(mutations, [it,val])

  doFirst = (actions, args) ->
    match = undefined
    _(actions).find (o) ->
      if o.test.apply(@, args)
        match = o.action.apply(@, args)
        true
    match

  doAll = (actions, args) ->
    thing = it: args[0], val: args[1]
    _(actions).find (o) ->
      if o.test.call(@, thing.it, thing.val)
        thing.val = o.action.call(@, thing.it, thing.val)
        true
    thing.val


  $ -> f.fill()
)(f.$,f._)

