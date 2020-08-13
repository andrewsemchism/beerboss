# BeerBoss.ca

Beerboss.ca is a tool to make buying beer from The Beer Store easier. Since
alcohol sales are regulated by the government in Ontario, there are very few
options when buying beer. The Beer Store does not want to give you the
information needed to make educated choices when buying beer.\

Beer Boss scrapes The Beer Store website and displays the information in an
organized table. The table can be sorted and filtered in ways that are not
possible on the official beer store website. Most importantly, it allows
you to filter by cost per drink. This makes it easy to get the most bang for
your buck! No longer will you wonder if buying a case of bottles or cans is more
economical. Beer Boss does all the work for you!\

Beer Boss can even factor in the bottle deposits into the calculations to ensure
you are getting the best price.

## How does it work

A python script scrapes every product on The Beer Store Website and uploads it
to a MySQL database. The website reads this data and displays it for the user.
Currently, the python script is not included in the repository.

## Built With

* NodeJS
* Express
* MySQL
* Python (beautiful soup, requests)
