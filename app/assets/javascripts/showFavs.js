var showFavorites = function(){
  $.getJSON("bands/favorite").done(function(faves){

    /////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////
    // Bigass for loop //  (add some templates here, please)
    /////////////////////

    for (var i = 0; i < faves.length; i++){

      // For each favorite band, we create a card to display (it starts out empty, we'll append stuff to it)
      var favorite_card = $("<div id='icard' data-method='faves_card' data-name='" + faves[i]['name'] + "' data-date='" + faves[i]['created_at'] + "' data-id='" + faves[i]['id'] + "' class='favorite_card'></div>");

      //////////////////////
      // Append #1: Photo //
      //////////////////////

      $("<div class='band_photo_box' data-name='" + faves[i]['name'] + "' data-date='" + faves[i]['created_at'] + "' data-id='" + faves[i]['id'] +
        "'><p class='name'>" + faves[i]['name'] + "</p>" +
         "<p><div class='band_photo' data-id='" + faves[i]['id'] +
         "'>" + "<img style='height: 200px; width: auto' src='" + faves[i]['image'] + "'></div></p>" +
         "</div>").hide().appendTo(favorite_card).fadeIn(1000);

      $('.band_photo').css('cursor', 'pointer');  // Why the hell is this not in a CSS file?

      ///////////////////////////////////////////////
      // Append #2: On Tour dates (or not on tour) //
      ///////////////////////////////////////////////

      if (faves[i]['on_tour'] == "null" || faves[i]['on_tour'] == ""){
        $(favorite_card).append("<div data-id='" + faves[i]['id'] + "' class='on_tour_box'>" + faves[i]['name'] + " - not currently on tour.</div>");
      } else {
        $(favorite_card).append("<div data-id='" + faves[i]['id'] + "' class='on_tour_box'>" + faves[i]['name'] + " is on tour until " + faves[i]['on_tour'] + "!<br>" +
                                "<div class='tour_dates_link'><a href='" + faves[i]['tour_dates'] + "' target='_blank'>Click for tour dates and locations</a>.</div></div>")
        .hide().appendTo('#bands_results').fadeIn(1000);;
      };

      /////////////////////////////////////////////////////////
      // Append #3: Everything else (news, blogs, and sites) //
      /////////////////////////////////////////////////////////

      $("<div data-id='" + faves[i]['id'] + "' class='news_box' data-id='" + faves[i]['name'] +
        "'>Recent news stories tagged with " + faves[i]['name'] + ":<br>" +
         "• <a href='" + faves[i]['news'] + "' target='_blank'>" + faves[i]['news1'] + "</a><br>" +
         "• <a href='" + faves[i]['newsa'] + "' target='_blank'>" + faves[i]['news1a'] + "</a><br><br>" +
         "Recent blog posts featuring " + faves[i]['name'] + ":<br>" +
         "• <a href='" + faves[i]['blogs'] + "' target='_blank'>" + faves[i]['blogs1'] + "</a><br>" +
         "• <a href='" + faves[i]['blogsa'] + "' target='_blank'>" + faves[i]['blogs1a'] + "</a><br></div>" +
         "<div data-id='" + faves[i]['id'] + "' class='links_box'><p><a href='" + faves[i]['urls'] + "' target='_blank'>" + faves[i]['name'] + "'s offical website</a>.</p>" +
         "<p><a href='" + faves[i]['urls1'] + "' target='_blank'>" + faves[i]['name'] + " on Last.fm</a>.</p>" +
         "<p><a href='" + faves[i]['urls2'] + "' target='_blank'>Follow " + faves[i]['name'] + " on Twitter</a>.</p></div>" +
         // "<p><iframe id='ytplayer' type='text/html' width='300' height='200' src='" + faves[i]['video'] + "&output=embed&alt=jsonc' frameborder='0'/></p>" +
         // </hidden in slide toggle>
         "<br><div data-id='" + faves[i]['id'] + "' id='del_button'>" +
         "<button class='remove_favorite' data-method='delete' data-id='" + faves[i]['id'] +
         "'>Unfavorite</button>" +
         "</div>" + // ends del_button div
        "</div>").appendTo(favorite_card); // ends favorite_card div

      ////////////////////////////////////////////////////
      // Final step: Append that sucker to results page //
      ////////////////////////////////////////////////////

      $('#bands_results').hide().append(favorite_card).fadeIn(1000); // appends all the favorite cards
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // NOTE: All this extra stuff could probably be defined outside of this larger function
    // You can make an event listener for stuff that hasn't been dynamically added yet, like so:
    // $('body').on('click', '.thisClass', function(){whatever})

    // Extra stuff #1: Fave Card Slide Toggle on Img Click (defined below)
    $(favCardSlideToggle())

    // Extra stuff #2: Delete button (defined below)
    $('.remove_favorite').on('click', deleteButton());

  }); // end of getJSON
}


var favCardSlideToggle = function(){

  // QUESTION: Do you actually give any div the class "title"? I can't find any use of it in your app

  $('.title').on('click', function(){
    $('.on_tour_box').slideUp('slow');
    $('.news_box').slideUp('slow');
    $('.links_box').slideUp('slow');
  })

  // This seems to be the one you're actually using

  $('.band_photo').on('click', function(event){
    var id = $(this).attr("data-id");
    $('.on_tour_box[data-id='+ id +']').slideToggle('slow');
    $('.news_box[data-id='+ id +']').slideToggle('slow');
    $('.links_box[data-id='+ id +']').slideToggle('slow');
  });
});


var deleteButton = function(event){

  var id = $(this).attr("data-id");

  var ajaxReq = $.ajax({
    url: "/bands/favorite/" + id,
    method: "DELETE",
    data: id
  });

  ajaxReq.done(function(){
    // this associates the entire .favorite_card with the [data-id='+ id +'] id .
    $('.favorite_card[data-id='+ id +']').fadeOut(1000, function(){
      $(this).remove();
    });
  });

});