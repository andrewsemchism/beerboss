$(document).ready(function() {

var table = $('#beerTable').DataTable({
  "columnDefs" : [
    {
        "targets": [ 2,4 ],
        "visible": false,
        "searchable": false
    }],
  "order": [
    [9, "asc"]
  ]
  });

  $('#depositButton').click(function() {
    // varable to store the new table data. This should be removed at some point. global vars are bad.
    var datas = [];
    // this if else statement determines the current state of the button
    if (this.innerHTML == "Include Bottle/Can Deposit") {
      this.innerHTML = "Exclude Bottle/Can Deposit";
      //changes the button colors using bootstrap
      $('#depositButton').toggleClass('btn-success')
      $('#depositButton').toggleClass('btn-danger')
      table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        data = this.data();
        var container = data['7']
        var price = parseFloat(data['8'].replace("$", ""))
        var size = parseFloat(data['6'])
        var quantity = parseFloat(data['5'])
        var abv = (parseFloat(data['3'].replace("%", "")))/100
        if ( (container == "Can" && size <= 1000) || (container == "Bottle" && size <= 630) ) {
          data['8'] = "$" + ((parseFloat(data['8'].replace("$", "")) - parseFloat(data['5'])*0.1).toFixed(2)).toString()
          price = parseFloat(data['8'].replace("$", ""))
          data['9'] = "$" + (price / (size*quantity*abv/17.75)).toFixed(2)
        } else if ((container == "Can" && size > 1000) || (container == "Bottle" && size > 630)) {
          data['8'] = "$" + ((parseFloat(data['8'].replace("$", "")) - parseFloat(data['5'])*0.2).toFixed(2)).toString()
          price = parseFloat(data['8'].replace("$", ""))
          data['9'] = "$" + (price / (size*quantity*abv/17.75)).toFixed(2)
        }
        datas.push(data);
      });

    } else {
      this.innerHTML = "Include Bottle/Can Deposit";
      //changes the button colors using bootstrap
      $('#depositButton').toggleClass('btn-success')
      $('#depositButton').toggleClass('btn-danger')
      table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        data = this.data();
        var container = data['7']
        var price = parseFloat(data['8'].replace("$", ""))
        var size = parseFloat(data['6'])
        var quantity = parseFloat(data['5'])
        var abv = (parseFloat(data['3'].replace("%", "")))/100
        if ( (container == "Can" && size <= 1000) || (container == "Bottle" && size <= 630) ) {
          data['8'] = "$" + ((parseFloat(data['8'].replace("$", "")) + parseFloat(data['5'])*0.1).toFixed(2)).toString()
          price = parseFloat(data['8'].replace("$", ""))
          data['9'] = "$" + (price / (size*quantity*abv/17.75)).toFixed(2)
        } else if ((container == "Can" && size > 1000) || (container == "Bottle" && size > 630)) {
          data['8'] = "$" + ((parseFloat(data['8'].replace("$", "")) + parseFloat(data['5'])*0.2).toFixed(2)).toString()
          price = parseFloat(data['8'].replace("$", ""))
          data['9'] = "$" + (price / (size*quantity*abv/17.75)).toFixed(2)
        }
        datas.push(data);
      });
    }
    // clears the table, adds the new data, reders the new table
    table.clear();
    table.rows.add(datas);
    table.draw();
  });

  //Scroll to beer table when clicking start now
  $(".startnow").click(function() {
    $('html,body').animate({
        scrollTop: $("#allbeerprices").offset().top
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
