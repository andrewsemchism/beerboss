import React from "react";
import styles from "./BeerStats.module.css";
import { Container } from "react-bootstrap";

const BeerStats: React.FC = () => {
  return (
    <Container className={styles.stats}>
      <h2>The end of the $2 beer in Ontario</h2>
      <p>
        Beer Boss has been tracking beer prices since 2020. In December 2020,
        the median price of a single tall can (473ml) of beer was $3.15. Three
        years later in December 2023, it was $3.45—a 9.5% increase. In 2020, $2
        tall cans were common, but in 2023, we saw the last $2 tall cans
        disappear. In fact, the selection has narrowed significantly, with only
        around five beers offering tall cans for under $2.35.
      </p>
    </Container>
  );
};

export default BeerStats;
