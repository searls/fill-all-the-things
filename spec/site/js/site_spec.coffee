(($) ->

  describe "FillAllTheThings.Site", ->
    Given -> @$link = affix('a.bookmarklet')

    Given -> @subject = FillAllTheThings.Site()



    describe "#sprinkleBookmarklet", ->
      bookmarkletUrl = (url) -> "javascript:(function(){var d=document,s=d.createElement('scr'+'ipt');s.src='"+url+"';d.body.appendChild(s);})();"
      SCRIPT_PAGE = "http://searls.github.com/fill-all-the-things/dist/fill-all-the-things.min.js"
      Given -> window.location.hash = ""
      When -> @subject.sprinkleBookmarklet()
      Then -> expect(window.location.hash).toEqual('#'+bookmarkletUrl(SCRIPT_PAGE).replace(' ','%20'))
      Then -> expect(@$link.attr('href')).toEqual(bookmarkletUrl(SCRIPT_PAGE))

    describe "#preventDirectBookmarkletClicking", ->
      TEXT = """
              You\'re *this* close!

              Instructions:

              1. Drag this link to your bookmarks bar
              2. Click the bookmarklet from your bookmarks bar to fill in form fields.
             """
      Given -> @e = $.Event('click')
      Given -> spyOn(@e, "preventDefault")
      Given -> spyOn(window, "alert")
      Given -> @subject.preventDirectBookmarkletClicking()
      When -> @$link.trigger(@e)
      Then -> expect(alert).toHaveBeenCalledWith(TEXT)
      Then -> expect(@e.preventDefault).toHaveBeenCalled()

    describe "#init", ->
      Given -> spyOn(@subject, "sprinkleBookmarklet")
      Given -> spyOn(@subject, "preventDirectBookmarkletClicking")
      When -> @subject.init()
      Then -> expect(@subject.sprinkleBookmarklet).toHaveBeenCalled()
      Then -> expect(@subject.preventDirectBookmarkletClicking).toHaveBeenCalled()

)(FillAllTheThings.$)

