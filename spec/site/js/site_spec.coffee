(($) ->
  jasmineFixture($)
  describe "FillAllTheThings.Site", ->
    Given -> @subject = FillAllTheThings.Site()
  
    describe "description", ->
  
  
    describe "#sprinkleBookmarklet", ->
      bookmarkletUrl = (url) -> "javascript:(function(){var d=document,s=d.createElement('scr'+'ipt');s.src='"+url+"';d.body.appendChild(s);})();"
      SCRIPT_PAGE = "http://searls.github.com/fill-all-the-things/dist/fill-all-the-things.min.js"
      Given -> window.location.hash = ""
      # Given -> @$link = affix('a.bookmarklet')
      When -> @subject.sprinkleBookmarklet()
      Then -> expect(window.location.hash).toEqual('#'+bookmarkletUrl(SCRIPT_PAGE).replace(' ','%20'))
#      Then -> expect(@$link.attr('href')).toEqual(bookmarkletUrl(SCRIPT_PAGE))

)(FillAllTheThings.$)

