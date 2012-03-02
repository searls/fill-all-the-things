###
fill-all-the-things @@VERSION@@
Fills out forms with dummy data
site: https://searls.github.com/fill-all-the-things

@depend ../vendor/jquery-no-conflict.js
@depend ../vendor/underscore-no-conflict.js

###
f = window.FillAllTheThings ||= {}

( ($,_) ->

  f.actions = [
      test: (it) -> it.is(':checkbox,:radio')
      action: (it) -> it.attr('checked','checked')
    ,
      test: (it) -> it.is('select')
      action: (it) -> it.find('option[value="1975"],option:last').val()
    ,
      test: -> true
      action: (it, val) -> f.figureOutAValue(it, val)
  ]

  f.fill = ->
    $inputs = $(':input:visible:enabled').val (i, val) ->
      it = $(@)
      newVal = val
      _(f.actions).find (o) ->
        if o.test(it, val)
          newVal = o.action(it, val)
          true
      newVal

  f.figureOutAValue = (it, val) ->
    if it.is(':password')
      "f1llTh!NG$?"
    else if it.is('[type="email"]') or /email/i.test(it.attr('name'))
      "fill@llthethings.org"
    else if it.is('[type="tel"]')
      "123-456-7890"
    else if it.is('[type="url"]')
      "http://www.w3.org"
    else if !val
      "Filling a Thing"
    else
      val


  $ ->
    f.fill()
)(f.$,f._)

