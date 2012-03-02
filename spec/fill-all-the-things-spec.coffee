describe "FillAllTheThings", ->
  window.Yields = (f) ->
    When -> FillAllTheThings.fill()
    Then(f)

  describe ".fill", ->
    describe "boring fields", ->
      Given -> @$input = affix('input')
      Yields -> @$input.val().length > 0

    describe "invisible fields", ->
      Given -> @$input = affix('input').hide()
      Yields -> @$input.val().length == 0

    describe "fields that already have values", ->
      Given -> @$input = affix('input[value="fooberry"]')
      Yields -> @$input.val() is "fooberry"

    describe "text fields", ->
      describe "filling in email fields", ->
        EMAIL = "fill@llthethings.org"
        context "type=email", ->
          Given -> @$input = affix('input[type="email"]')
          Yields -> @$input.val() == EMAIL

        context "name contains email", ->
          Given -> @$input = affix('input[name="userEmail"]')
          Yields -> @$input.val() == EMAIL

      describe "telephones", ->


    describe "password fields", ->
      Given -> @$input = affix('input[type="password"]')
      Yields -> @$input.val() == "f1llTh!NG$?"

    describe "checkboxen", ->
      Given -> @$input = affix('input[type="checkbox"]')
      Yields -> @$input.is(":checked")

    describe "radio buttons", ->
      Given -> @$input = affix('input[type="radio"]')
      Yields -> @$input.is(":checked")

    describe "select boxes", ->
      context "typically picks the last option", ->
        Given -> @$input = affix('select option[value="foo"]+option[value="bar"]')
        Yields -> @$input.val() is "bar"

      context "obviously age verifications", ->
        Given -> @$input = affix('select option[value="1975"]+option[value="2055"]')
        Yields -> @$input.val() is "1975"