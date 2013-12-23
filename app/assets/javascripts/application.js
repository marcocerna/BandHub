// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require underscore
//= require_tree .


// helps with security authentication tokens
$.ajaxSetup({
  headers: {
    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  }
});

// Kicks to the Isotope (not Isotope) calls file //
$(function(){
  isotope();
});



$(function(){
  $(document).ready(function(){
    $('.title').css('cursor', 'pointer');
   });


  // >--------THE SIDEBAR SEE_FAVES CLICK EVENT-------<
  $('#see_favorites').on('click', function(){
  $('#bands_results').empty();
    showFavorites();
  });

  // START OF MAIN SEARCH
  $("#bigDaddySearch").on('click', function(){
     event.preventDefault();

    // grab the params of the search form
    var query = $('#search_bands').val();

    // "GET" request to send search params to echonest api
    var get_request = $.ajax({
      // sends the rq to the apisController
      url: "apis/api",
      type: "get",
      dataType: "json",
      // encodeURIComponent removes the space b/t words & encodes it w a proper searchable symbol
      data: {band: encodeURIComponent(query)}
       }); // ends echonest ajax rq// "GET" request to send search params to echonest api

    //// FIRST LIST OF BAND NAMES ////
    // clear the div and the search field
    $("#bands_results").empty();
    $("search_bands").val("");

    get_request.done(function(data){
      // console.log(data);
      search_list_item = data['response']['artist']['name'];

        $('#bands_results').append("<div class='search_list_item'>" + search_list_item + "<div>");
        $('.search_list_item').css('cursor', 'pointer');

    }) // ends get_request.done function

         //>>>START OF THE SHOW DISPLAY<<<
    $('#bands_results').on('click', '.search_list_item', function(){
      var id = $(this).attr('id');
      var el = $('.search_list_item')[0]

      var fadeOut = function (op) {
        // console.log("fadeout")
        if(op>0){
         el.style.opacity = op;
         el.style.backgroundColor
         setTimeout(function(){
          fadeOut(op-.01);
         },1)
        }
      }
      fadeOut(1)


      get_request.done(function(data){
      // console.log(data);

      // PARSING ALL THE ECHONEST API DATA
      image = data['response']['artist']['images'][0];
      blogs = data['response']['artist']['blogs'].slice(0,2);
      blogsa = data['response']['artist']['blogs'][1];
      blogs1 = data['response']['artist']['blogs'].slice(0,2);
      blogs1a = data['response']['artist']['blogs'][1];
      reviews = data['response']['artist']['reviews'].slice(0,2);
      reviews1 = data['response']['artist']['reviews'].slice(0,2);
      news = data['response']['artist']['news'].slice(0,2);
      newsa = data['response']['artist']['news'][1];
      news1 = data['response']['artist']['news'].slice(0,2);
      news1a = data['response']['artist']['news'][1];
      urls = data['response']['artist']['urls'];
      urls1 = data['response']['artist']['urls'];
      urls2 = data['response']['artist']['urls'];
      // biographies = data['response']['artist']['biographies'][0];
      artist_location = data['response']['artist']['artist_location'];
      video = data['response']['artist']['video'].slice(0,1);

      // console.log(urls);
      // console.log(reviews.url);

      var songkick_get_request = $.ajax({
      url: "apis/songkick",
      type: "get",
      dataType: "json",
      data: {band: encodeURIComponent(query)}
       }); // ends songkick ajax rq

      songkick_get_request.done(function(data){
      // console.log(data);
      on_tour = data['resultsPage']['results']['artist'][0]['onTourUntil'];
      tour_dates = data['resultsPage']['results']['artist'][0]['uri'];

        // the flip card show display
      console.log("We're appending a div!")
      $('#bands_results').append("<div id='flip_container'>" +
                                 "<div id='flip_card' class='shadow'>" +
                                 "<div class='front face'><p>" + search_list_item +
                                 "</p></div>" +
                                 "<div class='back face center'>" +
                                 "<img style='height: 200px; width: auto' src='" + image.url +
                                 "'><button id='add_favorite'>Add " + search_list_item + " to Your BandHub Corral</button></div>" +
                                 "</div></div></div>");

          $('#add_favorite').on('click', function(){
            $('#flip_container').remove().fadeOut(1000);

            $('#bands_results').append("<div class='success_message'>" + search_list_item + " successfully saved to your profile.<br>" +
                                              "Click 'View BandHub Page' button to see " + search_list_item + "'s details!</div>").slideDown("fast").delay(2500).fadeOut(500);
////////////////////////////////////////
              $('#bands_results').empty();


            band_name = data['resultsPage']['results']['artist'][0]['displayName']

            var favorites = $.ajax({
              url: "bands/create",
              beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
              type: "POST",
              // assigns a new key value pair in params for ajax Favorite create
              data: {band_name: band_name,
                     blogs: blogs,
                     blogsa: blogsa,
                     blogs1: blogs1,
                     blogs1a: blogs1a,
                     image: image,
                     news: news,
                     newsa: newsa,
                     news1: news1,
                     news1a: news1a,
                     reviews: reviews,
                     reviews1: reviews1,
                     urls: urls,
                     urls1: urls1,
                     urls2: urls2,
                     on_tour: on_tour,
                     tour_dates: tour_dates,
                     // biographies: biographies,
                     artist_location: artist_location,
                     video: video}
              // success: showSuccessMessage

            }).done(function(){
              showFavorites(); // displays the favorites page after favoriting action

            }); // ends favorites ajax

          }); // ends #add_favorite actions
      ////////////////
    });  // ends songkick_get_request.done
    }); // ends first get_request.done
    }) // ends START OF THE SHOW DISPLAY onclick

  }) // ends bigDaddySearch

}) // ends main js function

