$(document).ready( function () {

  $('#beerTable').DataTable( {
    "order": [[9, "asc"]]
  } );

  //Scroll to beer table when clicking start now
  $(".startnow").click(function() {
    $('html,body').animate({
      scrollTop: $("#allbeerprices").offset().top},
      'slow');
  });
});
