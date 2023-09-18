# BeerBoss.ca

[Beerboss.ca](http://beerboss.ca/) is a tool to make buying beer from The Beer Store easier. Since alcohol
sales are regulated by the government in Ontario, there are very few options when buying beer. The official
Beer Store website does not give you the information needed to make educated choices when buying beer.

Beer Boss can help you find the cheapest beers in Ontario without the hassle of searching through hundreds
of beers on the Beer Store website manually. If you already have a particular beer in mind, Beer Boss can
easily determine the cheapest package size to buy.

Beer Boss can even factor in the bottle deposits into the calculations to ensure you are getting the best price.

## How does it work

A python script scrapes every product on The Beer Store website and uploads it
to a MySQL database. The website reads this data and displays it for the user.
Currently, the python script is not included in the repository.

## Running locally

To run the site locally for development, install [Docker](https://docs.docker.com/get-docker/) and run
`docker compose --profile dev up`

<!-- Update this section for new tech stack

## Built With

- React
- Typescript
- Bootstrap
- [DataTables](https://github.com/DataTables/DataTables)
- Express
- MySQL
- Python (beautifulsoup, requests, MySQL Connector)

-->
