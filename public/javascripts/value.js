$(document).ready(function () {

    $('#value-loader').hide();
    $('.value-introduction').show();
    
    $('#beer-picker').selectpicker({ virtualScroll: false });

    function getColor(value) {
        //value from 0 to 1
        value = value * 4 <= 1 ? value * 4 : 1
        var hue = ((1 - value) * 120).toString(10);
        return ["hsl(", hue, ",100%, 80%)"].join("");
    }

    // If percentage is over 1 return 1
    function getPercentage(basePrice, price) {
        let percentage = (price / basePrice) - 1;
        console.log(percentage);
        return percentage <= 1 ? percentage : 1;
    }

    function updateTable() {
        if ($('#include-bottles').is(':checked') && $('#include-cans').is(':checked') && $('#include-kegs').is(':checked')) {
            table.column(3).search('', true, false).draw()
        } else if ($('#include-bottles').is(':checked') && $('#include-cans').is(':checked')) {
            table.column(3).search('bottle|can', true, false).draw()
        } else if ($('#include-bottles').is(':checked') && $('#include-kegs').is(':checked')) {
            table.column(3).search('bottle|keg', true, false).draw()
        } else if ($('#include-cans').is(':checked') && $('#include-kegs').is(':checked')) {
            table.column(3).search('can|keg', true, false).draw()
        } else if ($('#include-cans').is(':checked')) {
            table.column(3).search('can', true, false).draw()
        } else if ($('#include-bottles').is(':checked')) {
            table.column(3).search('bottle', true, false).draw()
        } else if ($('#include-kegs').is(':checked')) {
            table.column(3).search('keg', true, false).draw()
        } else {
            table.column(3).search('none', true, false).draw()
        }
        /*
        if (this.attr('id') == 'include-cans') {
            
        } else if (this.attr('id') == 'include-kegs') {
            toggleKegs();
        }
        */
    }

    var table = $('#value-table').DataTable(
        {
            responsive: true,
            "order": [
                [5, "asc"]
            ],
            "columns": [
                { "orderable": false },
                { "orderable": false },
                { "orderable": false },
                { "orderable": false },
                { "orderable": false },
                { "orderable": false },
                { "orderable": false }
            ],
            "sDom": 'lrtip',
            "language": {
                "zeroRecords": "No results. Please select a beer and filters."
            },
            "pageLength": 100,
        }
    );

    // Display no beers initially
    table.column('0').search("^" + 'N/A' + "$", true, false).draw()

    $('#beer-picker').change(redrawTable);
    
    function redrawTable() {
        // Clear filters temporarily
        table.column(3).search('', true, false).draw()

        // Fill the table with the correct beer
        let val = $('#beer-picker').val();
        console.log('^' + val + '$')
        table.column('0').search("^" + val + "$", true, false).draw()

        // Colour code the cost per serving
        // Get list of all table rows
        table.page.len(50).draw()
        let allRows = $("#value-table > tbody > tr")
        console.log(allRows);
        let allPrices = [];
        allRows.each(function (index, tr) {
            allPrices.push(tr.children[5]);
        });

        // Baseline price
        let baseLine = parseFloat(allPrices[0].innerHTML.substring(1));

        for (let price of allPrices) {
            let percentage = getPercentage(baseLine, price.innerHTML.substring(1));
            console.log(percentage);
            let colour = getColor(percentage);
            price.style.backgroundColor = colour;
        }

        // Re-add filters.
        updateTable();
        table.page.len(25).draw()
    }

    // Change of filters
    $(":checkbox").change(function () {
        updateTable();
    });
    /*
    // mobile media query
    function toggleMobile(x) {
        if (x.matches) { // If media query matches
            $('#beer-picker').attr('selectpicker', 'mobile');
        } else {
            $('#beer-picker').attr('selectpicker', 'desktop');
        }
    }

    var x = window.matchMedia("(max-width: 992px)")
    toggleMobile(x) // Call listener function at run time
    x.addListener(toggleMobile) // Attach listener function on state changes
    */
    // Quick picks buttons
    var buttons = document.querySelectorAll("#quick-picks button");
    buttons.forEach((button) => {
        var beerText = button.innerHTML;
        button.addEventListener('click', () => {
            $('#beer-picker').selectpicker('val', beerText);
            redrawTable()
        })
    });
});