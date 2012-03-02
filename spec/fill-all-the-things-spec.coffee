(($,_) ->
  describe "FillAllTheThings", ->
    window.Yields = (f) ->
      When -> FillAllTheThings.fill()
      Then(f)

    describe ".fill", ->
      describe "events", ->
        Given -> spyOn(_, "defer").andCallFake (f) -> f()
        Given -> @$input = affix('input')
        Given -> @$input.on('change', => @triggered = true)

        context "value got changed", ->
          When -> FillAllTheThings.fill()
          Then -> @triggered is true

        context "value wasn't changed", ->
          Given -> @$input.val('foo')
          When -> FillAllTheThings.fill()
          Then -> @triggered isnt true


      describe "input states", ->
        context "boring fields", ->
          Given -> @$input = affix('input')
          Yields -> @$input.val().length > 0

        context "invisible fields", ->
          Given -> @$input = affix('input').hide()
          Yields -> @$input.val().length == 0

        context "fields that already have values", ->
          Given -> @$input = affix('input[value="fooberry"]')
          Yields -> @$input.val() is "fooberry"

        context "disabled fields", ->
          Given -> @$input = affix('input').attr('disabled','disabled')
          Yields -> @$input.val().length == 0

        context "fields with maxlength specified", ->
          Given -> @$input = affix('input').attr('maxlength', 3)
          Yields -> @$input.val().length is 3

        context "fields with readonly specified", ->
          Given -> @$input = affix('input').attr('readonly','readonly')
          Yields -> @$input.val().length == 0


      describe "field types", ->
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
            PHONE="1234567890"
            context "type=tel", ->
              Given -> @$input = affix('input[type="tel"]')
              Yields -> @$input.val() is PHONE
            context "named phone", ->
              Given -> @$input = affix('input[name="phone"]')
              Yields -> @$input.val() is PHONE

          describe "url", ->
            Given -> @$input = affix('input[type="url"]')
            Yields -> @$input.val() is "http://www.w3.org"

          describe "password fields", ->
            Given -> @$input = affix('input[type="password"]')
            Yields -> @$input.val() == "f1llTh!NG$?"

          describe "numeric stuff", ->
            context "has a .numeric class", ->
              Given -> @$input = affix('input.numeric')
              Yields -> isFinite(parseInt(@$input.val(),10))

            context "is a range", ->
              Given -> @$input = affix('input[type="range"]')
              Yields -> parseInt(@$input.val(),10) is 0

            context "has a min", ->
              Given -> @$input = affix('input[min="5"]')
              Yields -> @$input.val() == "5"

            context "has a max", ->
              Given -> @$input = affix('input[max="50"]')
              Yields -> @$input.val() == "50"

            context "has it all", ->
              Given -> @$input = affix('input.numeric[min="10"][max="13"]')
              Yields ->
                n = parseInt(@$input.val(),10)
                isFinite(n) and n >= 10 and n <= 13


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
)(FillAllTheThings.$,FillAllTheThings._)

