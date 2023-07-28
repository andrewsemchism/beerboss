$(document).ready(function() {

var table = $('#beerTable').DataTable({
  responsive: true,
  "columnDefs" : [
    {
        "targets": [2, 4],
        "visible": false,
        "searchable": false,
    }],
  "order": [
    [10, "asc"]
  ],
  "language": {
    "search": "Search Beers: "
  },
  "lengthMenu": [10, 15, 25, 50],
  "pageLength": 15,
 
  });

  // Disable visibility of deposit price and deposit cost per serving of alcohol initially.
  table.column(9).visible(false);
  table.column(11).visible(false);

  /*
  To-do:
  - Improve filter behavour when swithcing between including or excluding deposit.
  */

  $('#depositButton').click(function() {
    if ($('#depositButton').text() == "Include Bottle/Can Deposit") {
      $('#depositButton').text("Exclude Bottle/Can Deposit")
    } else {
      $('#depositButton').text("Include Bottle/Can Deposit")
    }
    toggleOnOff($('#depositButton'))
    // If column 9 is visible, make it invisible and make column 10 visible
    table.column(8).visible(!table.column(8).visible());
    table.column(9).visible(!table.column(9).visible());
    table.column(10).visible(!table.column(10).visible());
    table.column(11).visible(!table.column(11).visible());

    console.log(table.order()[0])
    console.log(table.order()[0][0] == 10 && table.order()[0][1] == "asc")
    if (!table.column(10).visible() && table.order()[0][0] == 10 && table.order()[0][1] == "asc") {
      table.order([11, "asc"]).draw();
    } else if (!table.column(11).visible() && table.order()[0][0] == 11 && table.order()[0][1] == "asc") {
      table.order([10, "asc"]).draw();
    }
  });

  //Scroll to beer table when clicking start now
  $(".startnow").click(function() {
    $('html,body').animate({
        scrollTop: $("#using-beerboss").offset().top
      },
      'slow');
  });


  // The filters
  $("#bottle").click(function() {
    toggleOnOff($(this))
    containerRefresh()
  });

  $("#can").click(function() {
    toggleOnOff($(this))
    containerRefresh()
  });

  $("#keg").click(function() {
    toggleOnOff($(this))
    containerRefresh()
  });

  function toggleOnOff(button) {
    button.toggleClass('btn-success')
    button.toggleClass('btn-danger')
  }

  function containerRefresh() {
    if ($("#bottle").hasClass('btn-success') && $("#can").hasClass('btn-success') && $("#keg").hasClass('btn-success')) {
      table.column(7).search('').draw()
    } else if ($("#bottle").hasClass('btn-success') && $("#can").hasClass('btn-success')) {
      table.column(7).search('bottle|can', true, false).draw()
    } else if ($("#bottle").hasClass('btn-success') && $("#keg").hasClass('btn-success')) {
      table.column(7).search('bottle|keg', true, false).draw()
    } else if ($("#can").hasClass('btn-success') && $("#keg").hasClass('btn-success')) {
      table.column(7).search('can|keg', true, false).draw()
    } else if ($("#bottle").hasClass('btn-success')) {
      table.column(7).search('bottle').draw()
    } else if ($("#can").hasClass('btn-success')) {
      table.column(7).search('can').draw()
    } else if ($("#keg").hasClass('btn-success')) {
      table.column(7).search('keg').draw()
    } else {
      table.column(7).search('none').draw()
    }
  }

});
