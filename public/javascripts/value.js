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

$(document).ready(function () {
    var table = $('#value-table').DataTable(
        {
            "order": [
                [5, "asc"]
            ],
            "sDom": 'lrtip',
            "language": {
                "zeroRecords": "Please select a beer"
            },
            "pageLength": 100,
        }
    );
    
    // Display no beers initially
    table.column('0').search("^" + 'N/A' + "$", true, false).draw()

    $('#beer-picker').change(function () {
        // FIll the table with the correct beer
        let val = $(this).val();
        console.log('^'+val+'$')
        table.column('0').search("^" + val + "$", true, false).draw()

        // Colour code the cost per serving
        // Get list of all table rows
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

        table.page.len(25).draw()

        console.log(allPrices)
    });
});